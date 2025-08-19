import { Controller } from '@nestjs/common';
import { ClientTypeService } from './client-type.service';

@Controller('client-type')
export class ClientTypeController {
  constructor(private readonly clientTypeService: ClientTypeService) {}
}
