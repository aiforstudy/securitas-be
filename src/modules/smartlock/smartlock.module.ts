import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartLock } from './entities/smartlock.entity';
import { SmartLockEvent } from './entities/smartlock-event.entity';
import { SmartLockService } from './smartlock.service';
import { SmartLockController } from './smartlock.controller';
import { SmartLockEventService } from './smartlock-event.service';
import { SmartLockEventController } from './smartlock-event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SmartLock, SmartLockEvent])],
  controllers: [SmartLockController, SmartLockEventController],
  providers: [SmartLockService, SmartLockEventService],
  exports: [SmartLockService, SmartLockEventService],
})
export class SmartLockModule {}
