import { Injectable } from '@nestjs/common';
import { Agreement } from './agreement.entity';
import { ServiceValueDto } from 'src/resources/parking-service/dto/service-value-dto';
import { GetActiveAgreementsDto } from './dto/get-active-agreements-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { CreateAgreementDto } from './dto/create-agreement-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { AgremeentClientExists, AgremeentNotExists } from './agreement.errors';
import { EditAgreementDto } from './dto/edit-agreement-dto';

@Injectable()
export class AgreementService {
    constructor(
        @InjectRepository(Agreement)
        private readonly agreementRepo: Repository<Agreement>
    ) {}

    async calculateServiceDiscount(agreement: Agreement, serviceValue: number): Promise<ServiceValueDto> {
        
    }

    async getActiveAgreements(getActiveAgreementsDto: GetActiveAgreementsDto): Promise<Agreement[]> {
        try {  
            const query = this.agreementRepo
                .createQueryBuilder('agreement')
                    .innerJoinAndSelect('agreement.client', 'client')
                .where('agreement.isActive = :active', { active: true });
            
            if(getActiveAgreementsDto.idClient) {
                query.andWhere('agreement.idClient = :idClient', { 
                    idClient: getActiveAgreementsDto.idClient 
                });
            }

            if(getActiveAgreementsDto.dateExpirationStart && getActiveAgreementsDto.dateExpirationEnd) {
                query.andWhere('agreement.dateExpiration BETWEEN :dateExpirationStart AND :dateExpirationEnd', { 
                    dateExpirationStart: getActiveAgreementsDto.dateExpirationStart,
                    dateExpirationEnd: getActiveAgreementsDto.dateExpirationEnd,
                })
            }
                
            const agreements = await query.getMany();
            
            return agreements;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async createAgreement(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
        try {
            const agreementData = this.agreementRepo.create({
                client: {
                    idClient: createAgreementDto.idClient
                },
                percentageDiscount: createAgreementDto.percentageDiscount,
                fixDiscount: createAgreementDto.fixDiscount,
                dateExpiration: createAgreementDto.dateExpiration
            });
            const agreement = await this.agreementRepo.save(agreementData);

            return agreement;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new AgremeentClientExists()
                ]
            })
        }
    }
    
    async editAgreement(idAgreement: number, editAgreementDto: EditAgreementDto): Promise<Agreement> {
        const [loadError, agreementData] = await promiseCatchError(this.agreementRepo.preload({
            idAgreement: idAgreement,
            ... {
                fixDiscount: editAgreementDto.fixDiscount,
                percentageDiscount: editAgreementDto.percentageDiscount,
                client: {
                    idClient: editAgreementDto.idClient
                }
            }
        }));
        
        if(loadError)
            throw new DatabaseError();
            
        if(typeof agreementData === 'undefined') throw new AgremeentNotExists();

        try {
            const updatedAgreement = await this.agreementRepo.save(agreementData);
            
            return updatedAgreement;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new AgremeentClientExists()
                ]
            });
        }
    }

    async deleteAgreement(idAgreement: number): Promise<void> {
        const [agreementError, result] = await promiseCatchError(this.agreementRepo
            .update(idAgreement, { isActive: false })
        );
        if(agreementError) throw new DatabaseError();
        if(result.affected === 0) throw new AgremeentNotExists();
    }
}
