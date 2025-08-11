import { Controller } from '@nestjs/common';
import { ParkingServiceService } from './parking-service.service';

@Controller('parking-service')
export class ParkingServiceController {
  constructor(private readonly parkingServiceService: ParkingServiceService) {}
}
