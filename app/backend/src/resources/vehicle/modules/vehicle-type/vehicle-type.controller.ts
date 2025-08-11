import { Controller } from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';

@Controller('vehicle-type')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}
}
