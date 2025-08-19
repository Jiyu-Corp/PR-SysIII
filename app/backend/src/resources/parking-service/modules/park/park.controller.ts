import { Controller } from '@nestjs/common';
import { ParkService } from './park.service';

@Controller('park')
export class ParkController {
  constructor(private readonly parkService: ParkService) {}
}
