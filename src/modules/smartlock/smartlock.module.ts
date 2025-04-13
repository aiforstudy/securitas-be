import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartLockService } from './smartlock.service';
import { SmartLockController } from './smartlock.controller';
import { SmartLock } from './entities/smartlock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartLock])],
  controllers: [SmartLockController],
  providers: [SmartLockService],
  exports: [SmartLockService],
})
export class SmartLockModule {}
