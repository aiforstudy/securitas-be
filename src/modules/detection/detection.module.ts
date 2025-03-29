import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionService } from './detection.service';
import { DetectionController } from './detection.controller';
import { Detection } from './entities/detection.entity';
import { EngineModule } from '../engine/engine.module';
import { MonitorModule } from '../monitor/monitor.module';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Detection]),
    MonitorModule,
    EngineModule,
    NotificationModule,
  ],
  controllers: [DetectionController],
  providers: [DetectionService],
  exports: [DetectionService],
})
export class DetectionModule {}
