import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { getTypeOrmConfig } from './config/typeorm.config';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './modules/company/company.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { DetectionModule } from './modules/detection/detection.module';
import { EngineModule } from './modules/engine/engine.module';
import { AuthModule } from './modules/auth/auth.module';
import { SmartLockModule } from './modules/smartlock/smartlock.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(`configurations/.env.${process.env.NODE_ENV}`),
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    CompanyModule,
    EngineModule,
    MonitorModule,
    DetectionModule,
    AuthModule,
    SmartLockModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
