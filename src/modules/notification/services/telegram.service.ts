import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyNotificationSetting } from '../entities/company-notification-setting.entity';
import { CompanyService } from '../../company/company.service';
import { EngineService } from '../../engine/engine.service';
import { MonitorService } from '../../monitor/monitor.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-tz';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly BOT_TOKEN: string;
  private readonly BASE_URL: string;

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

  async sendMessage(
    companyId: string,
    message: string,
    media?: any,
  ): Promise<boolean> {
    try {
      // Get notification settings for the company
      const settings = await this.notificationSettingRepository.findOne({
        where: { company_id: companyId },
      });

      if (!settings || !settings.telegram_group_id) {
        this.logger.warn(`No Telegram group ID found for company ${companyId}`);
        return false;
      }

      // Send message to Telegram group
      const response = await axios.post(`${this.BASE_URL}/sendMessage`, {
        chat_id: settings.telegram_group_id,
        text: message,
        parse_mode: 'HTML',
        ...media,
      });

      if (response.data.ok) {
        this.logger.log(
          `Message sent successfully to group ${settings.telegram_group_id}`,
        );
        return true;
      } else {
        this.logger.error(
          `Failed to send message: ${response.data.description}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`Error sending Telegram message: ${error.message}`);
      return false;
    }
  }

  async sendDetectionAlert(
    companyId: string,
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
      const company = await this.companyService.findOne(companyId);
      if (!company) {
        this.logger.warn(`Company not found: ${companyId}`);
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
      return await this.sendMessage(companyId, message, media);
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
    message += `Time: ${timestamp}\n`;
    message += `Status: ${detection.status}\n`;
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
}
