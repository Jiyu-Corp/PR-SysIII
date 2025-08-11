import { Controller } from '@nestjs/common';
import { TicketModelService } from './ticket-model.service';

@Controller('ticket-model')
export class TicketModelController {
  constructor(private readonly ticketModelService: TicketModelService) {}
}
