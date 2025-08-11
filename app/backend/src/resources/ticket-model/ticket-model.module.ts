import { Module } from '@nestjs/common';
import { TicketModelService } from './ticket-model.service';
import { TicketModelController } from './ticket-model.controller';

@Module({
  controllers: [TicketModelController],
  providers: [TicketModelService],
})
export class TicketModelModule {}
