import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetectionService } from './detection.service';
import { DetectionController } from './detection.controller';
import { Detection } from './entities/detection.entity';
import { Monitor } from '../monitor/entities/monitor.entity';
import { EngineModule } from '../engine/engine.module';

@Module({
  imports: [TypeOrmModule.forFeature([Detection, Monitor]), EngineModule],
  controllers: [DetectionController],
  providers: [DetectionService],
  exports: [DetectionService],
})
export class DetectionModule {}
