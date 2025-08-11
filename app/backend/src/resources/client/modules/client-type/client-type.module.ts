import { Module } from '@nestjs/common';
import { ClientTypeService } from './client-type.service';
import { ClientTypeController } from './client-type.controller';

@Module({
  controllers: [ClientTypeController],
  providers: [ClientTypeService],
})
export class ClientTypeModule {}
