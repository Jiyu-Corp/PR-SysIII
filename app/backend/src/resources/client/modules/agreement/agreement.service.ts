import { Injectable } from '@nestjs/common';
import { Agreement } from './agreement.entity';
import { ServiceValueDto } from 'src/resources/parking-service/dto/service-value-dto';

@Injectable()
export class AgreementService {
    async calculateServiceDiscount(agreement: Agreement, serviceValue: number): Promise<ServiceValueDto> {
            
    }
}
