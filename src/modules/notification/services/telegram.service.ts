import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyNotificationSetting } from '../entities/company-notification-setting.entity';
import { CompanyService } from '../../company/company.service';
import { EngineService } from '../../engine/engine.service';
import { MonitorService } from '../../monitor/monitor.service';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-tz';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly BOT_TOKEN: string;
  private readonly BASE_URL: string;
  private readonly MAX_RETRIES = 3;
  private readonly TIMEOUT = 10000; // 10 seconds

  constructor(
    @InjectRepository(CompanyNotificationSetting)
    private readonly notificationSettingRepository: Repository<CompanyNotificationSetting>,
    private readonly companyService: CompanyService,
    private readonly engineService: EngineService,
    private readonly monitorService: MonitorService,
    private readonly configService: ConfigService,
  ) {
    this.BOT_TOKEN = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!this.BOT_TOKEN) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables',
      );
    }
    this.BASE_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}`;
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

  async sendMessage(
    company_code: string,
    message: string,
    media?: any,
  ): Promise<boolean> {
    try {
      // Get notification settings for the company
      const settings = await this.notificationSettingRepository.findOne({
        where: { company_code },
      });

      if (!settings || !settings.telegram_group_id) {
        this.logger.warn(
          `No Telegram group ID found for company ${company_code}`,
        );
        return false;
      }

      // Prepare request payload
      const payload = {
        chat_id: settings.telegram_group_id,
        text: message,
        parse_mode: 'HTML',
        ...media,
      };

      // Log request details
      this.logger.log('Telegram API Request:', {
        url: `${this.BASE_URL}/sendMessage`,
        payload,
        timeout: this.TIMEOUT,
      });

      // Send message with retry logic
      const response = await this.retryRequest(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

        try {
          const res = await fetch(`${this.BASE_URL}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          return res;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      });

      const data = await response.json();

      if (data.ok) {
        this.logger.log(
          `Message sent successfully to group ${settings.telegram_group_id}`,
        );
        return true;
      } else {
        this.logger.error(`Failed to send message: ${data.description}`);
        return false;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logger.error('Telegram API Timeout:', {
          message: 'Request timed out',
          timeout: this.TIMEOUT,
        });
      } else if (error instanceof Error) {
        this.logger.error('Telegram API Error:', {
          message: error.message,
          stack: error.stack,
        });
      } else {
        this.logger.error(`Error sending Telegram message: ${error}`);
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
      // return await this.sendMessage(company_code, message, media);
      return true;
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

    let message = `<b>New Detection Alert</b>\n\n`;
    message += `Company: ${company.name}\n`;
    message += `Monitor: ${monitor.name}\n`;
    message += `ID: ${detection.id}\n`;
    message += `Time: ${timestamp} ${timezone}\n`;
    // message += `Status: ${detection.status}\n`;
    message += `Engine: ${engine.name}\n`;
    if (engine.description) {
      message += `Description: ${engine.description}\n`;
    }
    message += '\n';

    let media = undefined;

    if (detection.image_url) {
      message += `<a href="${detection.image_url}">View Image</a>\n`;
      media = {
        photo: detection.image_url,
        caption: message,
      };
    } else if (detection.video_url) {
      message += `<a href="${detection.video_url}">View Video</a>\n`;
      media = {
        video: detection.video_url,
        caption: message,
      };
    }

    return { message, media };
  }

  async sendMessagePure(
    chatId: string,
    message: string,
    media?: { photo?: string; video?: string },
  ): Promise<boolean> {
    try {
      let curlCommand = `curl -X POST "${this.BASE_URL}/sendMessage" `;
      curlCommand += `-H "Content-Type: application/json" `;
      curlCommand += `-d '{"chat_id":"${chatId}","text":"${message.replace(/"/g, '\\"')}","parse_mode":"HTML"}'`;

      if (media?.photo) {
        curlCommand = `curl -X POST "${this.BASE_URL}/sendPhoto" `;
        curlCommand += `-H "Content-Type: application/json" `;
        curlCommand += `-d '{"chat_id":"${chatId}","photo":"${media.photo}","caption":"${message.replace(/"/g, '\\"')}","parse_mode":"HTML"}'`;
      } else if (media?.video) {
        curlCommand = `curl -X POST "${this.BASE_URL}/sendVideo" `;
        curlCommand += `-H "Content-Type: application/json" `;
        curlCommand += `-d '{"chat_id":"${chatId}","video":"${media.video}","caption":"${message.replace(/"/g, '\\"')}","parse_mode":"HTML"}'`;
      }

      this.logger.log('Executing curl command:', curlCommand);

      const { stdout, stderr } = await execAsync(curlCommand);
      const response = JSON.parse(stdout);

      if (response.ok) {
        this.logger.log(`Message sent successfully to chat ${chatId}`);
        return true;
      } else {
        this.logger.error(`Failed to send message: ${response.description}`);
        return false;
      }
    } catch (error) {
      this.logger.error('Error executing curl command:', error);
      return false;
    }
  }

  async sendDetectionAlertPure(
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
      // Get notification settings for the company
      const settings = await this.notificationSettingRepository.findOne({
        where: { company_code },
      });

      if (!settings || !settings.telegram_group_id) {
        this.logger.warn(
          `No Telegram group ID found for company ${company_code}`,
        );
        return false;
      }

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

      return await this.sendMessagePure(
        settings.telegram_group_id,
        message,
        media,
      );
    } catch (error) {
      this.logger.error(`Error sending detection alert: ${error.message}`);
      return false;
    }
  }
}
