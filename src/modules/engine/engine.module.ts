import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineService } from './engine.service';
import { EngineController } from './engine.controller';
import { Engine } from './entities/engine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Engine])],
  controllers: [EngineController],
  providers: [EngineService],
  exports: [EngineService],
})
export class EngineModule {}
