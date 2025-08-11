import { Injectable } from '@nestjs/common';
import { ParkingService } from '../../parking-service.entity';
import { ServiceValueDto } from '../../dto/service-value-dto';

@Injectable()
export class PriceTableService {
    async calculateServiceValue(parkingService: ParkingService): Promise<ServiceValueDto> {
        
    }
}
