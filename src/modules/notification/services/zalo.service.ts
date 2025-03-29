import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyNotificationSetting } from '../entities/company-notification-setting.entity';
import { CompanyService } from '../../company/company.service';
import { EngineService } from '../../engine/engine.service';
import { MonitorService } from '../../monitor/monitor.service';
import https from 'https';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-tz';

interface ZaloMessagePayload {
  text: string;
  attachment?: {
    type: 'image' | 'video';
    payload: {
      url: string;
    };
  };
}

interface ZaloRequestPayload {
  recipient: {
    user_id: string;
  };
  message: ZaloMessagePayload;
}

@Injectable()
export class ZaloService {
  private readonly logger = new Logger(ZaloService.name);
  private readonly OA_ID: string;
  private readonly OA_SECRET: string;
  private readonly BASE_URL: string;
  private readonly MAX_RETRIES = 3;
  private readonly TIMEOUT = 10000; // 10 seconds
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    @InjectRepository(CompanyNotificationSetting)
    private readonly notificationSettingRepository: Repository<CompanyNotificationSetting>,
    private readonly companyService: CompanyService,
    private readonly engineService: EngineService,
    private readonly monitorService: MonitorService,
    private readonly configService: ConfigService,
  ) {
    this.OA_ID = this.configService.get<string>('ZALO_OA_ID');
    this.OA_SECRET = this.configService.get<string>('ZALO_OA_SECRET');
    // if (!this.OA_ID || !this.OA_SECRET) {
    //   throw new Error(
    //     'ZALO_OA_ID or ZALO_OA_SECRET is not defined in environment variables',
    //   );
    // }
    this.BASE_URL = 'https://graph.zalo.me/v2.0';
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    // Get new token
    const tokenUrl = new URL(`${this.BASE_URL}/me/access_token`);
    tokenUrl.searchParams.append('app_id', this.OA_ID);
    tokenUrl.searchParams.append('app_secret', this.OA_SECRET);

    try {
      const response = await this.makeRequest(tokenUrl, {
        method: 'GET',
      });

      if (response.access_token) {
        this.accessToken = response.access_token;
        // Token expires in 1 hour, set expiry to 55 minutes to be safe
        this.tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);
        return this.accessToken;
      } else {
        throw new Error('Failed to get Zalo access token');
      }
    } catch (error) {
      this.logger.error('Error getting Zalo access token:', error);
      throw error;
    }
  }

  private async retryRequest(
    fn: () => Promise<any>,
    retries: number = this.MAX_RETRIES,
    delay: number = 1000,
  ): Promise<any> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retryRequest(fn, retries - 1, delay * 2);
    }
  }

  private async makeRequest(url: URL, options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.setTimeout(this.TIMEOUT);
      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  async sendMessage(
    company_code: string,
    message: string,
    media?: any,
  ): Promise<boolean> {
    try {
      // Get notification settings for the company
      const settings = await this.notificationSettingRepository.findOne({
        where: { company_code: company_code },
      });

      if (!settings || !settings.zalo_group_id) {
        this.logger.warn(`No Zalo group ID found for company ${company_code}`);
        return false;
      }

      // Get access token
      const accessToken = await this.getAccessToken();

      // Prepare request payload
      const payload: ZaloRequestPayload = {
        recipient: {
          user_id: settings.zalo_group_id,
        },
        message: {
          text: message,
        },
      };

      if (media?.photo) {
        payload.message.attachment = {
          type: 'image',
          payload: {
            url: media.photo,
          },
        };
      } else if (media?.video) {
        payload.message.attachment = {
          type: 'video',
          payload: {
            url: media.video,
          },
        };
      }

      // Log request details
      this.logger.log('Zalo API Request:', {
        url: `${this.BASE_URL}/me/message`,
        payload,
        timeout: this.TIMEOUT,
      });

      // Send message with retry logic
      const data = await this.retryRequest(async () => {
        const url = new URL(`${this.BASE_URL}/me/message`);
        url.searchParams.append('access_token', accessToken);

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
          },
          body: JSON.stringify(payload),
        };

        return this.makeRequest(url, options);
      });

      if (data.message_id) {
        this.logger.log(
          `Message sent successfully to Zalo group ${settings.zalo_group_id}`,
        );
        return true;
      } else {
        this.logger.error(`Failed to send message: ${data.message}`);
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Zalo API Error:', {
          message: error.message,
          stack: error.stack,
        });
      } else {
        this.logger.error(`Error sending Zalo message: ${error}`);
      }
      return false;
    }
  }

  async sendDetectionAlert(
    company_code: string,
    detection: {
      id: string;
      timestamp: Date;
      status: string;
      engine: string;
      monitor_id: string;
      image_url?: string;
      video_url?: string;
    },
  ): Promise<boolean> {
    try {
      // Get company timezone using CompanyService
      const company = await this.companyService.findOne(company_code);
      if (!company) {
        this.logger.warn(`Company not found: ${company_code}`);
        return false;
      }

      // Get engine details
      const engine = await this.engineService.findOne(detection.engine);
      if (!engine) {
        this.logger.warn(`Engine not found: ${detection.engine}`);
        return false;
      }

      // Get monitor details
      const monitor = await this.monitorService.findOne(detection.monitor_id);
      if (!monitor) {
        this.logger.warn(`Monitor not found: ${detection.monitor_id}`);
        return false;
      }

      // Get timezone from locale settings, default to UTC if not set
      const timezone = company.locale?.timezone || 'UTC';
      const { message, media } = this.formatDetectionMessage(
        detection,
        {
          name: company.name,
          locale: company.locale as any,
        },
        engine,
        monitor,
        timezone,
      );
      return await this.sendMessage(company_code, message, media);
    } catch (error) {
      this.logger.error(`Error sending detection alert: ${error.message}`);
      return false;
    }
  }

  private formatDetectionMessage(
    detection: {
      id: string;
      timestamp: Date;
      status: string;
      engine: string;
      monitor_id: string;
      image_url?: string;
      video_url?: string;
    },
    company: {
      name: string;
      locale?: {
        timezone: string;
      };
    },
    engine: {
      name: string;
      description?: string;
    },
    monitor: {
      name: string;
    },
    timezone: string,
  ): { message: string; media?: any } {
    const timestamp = format(detection.timestamp, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: timezone,
    });

    let message = `🔔 New Detection Alert\n\n`;
    message += `Company: ${company.name}\n`;
    message += `Monitor: ${monitor.name}\n`;
    message += `ID: ${detection.id}\n`;
    message += `Time: ${timestamp}\n`;
    message += `Status: ${detection.status}\n`;
    message += `Engine: ${engine.name}\n`;
    if (engine.description) {
      message += `Description: ${engine.description}\n`;
    }
    message += '\n';

    let media = undefined;

    if (detection.image_url) {
      message += `View Image: ${detection.image_url}\n`;
      media = {
        photo: detection.image_url,
      };
    } else if (detection.video_url) {
      message += `View Video: ${detection.video_url}\n`;
      media = {
        video: detection.video_url,
      };
    }

    return { message, media };
  }
}
