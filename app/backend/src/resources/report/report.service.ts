import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { ParkingService } from '../parking-service/parking-service.entity';
import { GetParkedServicesDto } from './dto/get-parked-services-dto';
import { ParkedServicesDto } from './dto/parked-services-dto';
import { formatDateTime } from 'src/utils/utils';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ParkingService)
        private readonly parkingServiceRepo: Repository<ParkingService>
    ) {}

    async getParkedServices(getParkedServicesDto: GetParkedServicesDto): Promise<ParkedServicesDto[]> {
        try {  
            const query = this.parkingServiceRepo
                .createQueryBuilder('parkingService')
                    .innerJoinAndSelect('parkingService.vehicle', 'vehicle')
                    .innerJoinAndSelect('vehicle.model', 'model')
                    .innerJoinAndSelect('model.brand', 'brand')
                    .leftJoinAndSelect('parkingService.clientEntry', 'clientEntry')
                .where('1=1');
            
            if(getParkedServicesDto.plate) {
                query.andWhere('parkingService.plate = :plate', { 
                    plate: getParkedServicesDto.plate 
                });
            }

            if(getParkedServicesDto.clientName) {
                query.andWhere('clientEntry.name = :name', { 
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
            const parkedServices: ParkedServicesDto[] = parkedServicesData.map(ps => ({
                plate: ps.vehicle.plate,
                brandModelYear: `${ps.vehicle.model.brand.name} - ${ps.vehicle.model.name} - ${ps.vehicle.year}`,
                clientName: ps.clientEntry?.name,
                dateParkingServiceStart: formatDateTime(ps.dateRegister),
                dateParkingServiceEnd: formatDateTime(ps.dateCheckout),
                price: ps.totalPrice
            } as ParkedServicesDto));
            
            return parkedServices;
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
