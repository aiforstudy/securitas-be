import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from '../company/company.module';
import { EngineModule } from '../engine/engine.module';
import { MonitorModule } from '../monitor/monitor.module';
import { CompanyNotificationSetting } from './entities/company-notification-setting.entity';
import { TelegramService } from './services/telegram.service';
import { ZaloService } from './services/zalo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyNotificationSetting]),
    ConfigModule,
    CompanyModule,
    EngineModule,
    MonitorModule,
  ],
  providers: [TelegramService, ZaloService],
  exports: [TelegramService, ZaloService],
})
export class NotificationModule {}
