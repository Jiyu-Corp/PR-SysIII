import { Controller, Get, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { GetVehiclesDto } from './dto/get-vehicles-dto';
import { Vehicle } from './vehicle.entity';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';

@Controller('vehicle')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    @Get('')
    async getVehicles(@Query() getVehiclesDto: GetVehiclesDto): Promise<Vehicle[]> {
        const [httpError, vehicles] = await promiseCatchErrorHTTPDefault(this.vehicleService.getVehicles(getVehiclesDto));
        if(httpError) throw httpError;
        
        return vehicles;
    }
}
