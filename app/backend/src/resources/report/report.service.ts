import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { ParkingService } from '../parking-service/parking-service.entity';
import { GetParkedServicesDto } from './dto/get-parked-services-dto';
import { FinishedParkingServices } from './dto/finished-parking-services-dto';
import { formatDateTime } from 'src/utils/utils';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ParkingService)
        private readonly parkingServiceRepo: Repository<ParkingService>
    ) {}

    async getParkedServices(getParkedServicesDto: GetParkedServicesDto): Promise<FinishedParkingServices[]> {
        try {  
            const query = this.parkingServiceRepo
                .createQueryBuilder('parkingService')
                    .innerJoinAndSelect('parkingService.vehicle', 'vehicle')
                    .leftJoinAndSelect('vehicle.model', 'model')
                    .leftJoinAndSelect('model.brand', 'brand')
                    .leftJoinAndSelect('parkingService.clientEntry', 'clientEntry')
                .where('parkingService.isParking = false')
                .andWhere('parkingService.dateCheckout IS NOT NULL');
            
            if(getParkedServicesDto.plate) {
                query.andWhere('vehicle.plate ILIKE :plate', { 
                    plate: `%${getParkedServicesDto.plate}%` 
                });
            }

            if(getParkedServicesDto.clientName) {
                query.andWhere('clientEntry.name ILIKE :name', { 
                    name: `%${getParkedServicesDto.clientName}%` 
                });
            }

            if(getParkedServicesDto.dateStart && getParkedServicesDto.dateEnd) {
                query.andWhere('parkingService.dateRegister BETWEEN :dateStart AND :dateEnd', { 
                    dateStart: getParkedServicesDto.dateStart,
                    dateEnd: getParkedServicesDto.dateEnd,
                })
            }
                
            const parkedServicesData = await query.getMany();
            const parkedServices: FinishedParkingServices[] = parkedServicesData.map(ps => ({
                plate: ps.vehicle.plate,
                brandModelYear: [ps.vehicle.model?.brand?.name ?? "", ps.vehicle.model?.name ?? "", ps.vehicle.year?.toString() ?? ""].filter(v => v != "").join(" - "),
                clientName: ps.clientEntry?.name,
                dateParkingServiceStart: formatDateTime(ps.dateRegister),
                dateParkingServiceEnd: formatDateTime(ps.dateCheckout),
                price: ps.totalPrice
            } as FinishedParkingServices));
            
            return parkedServices;
        } catch (err) {
            console.log(err)
            throw new DatabaseError();
        }
    }
}
