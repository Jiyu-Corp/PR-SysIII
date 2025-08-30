import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { Repository } from 'typeorm';
import { promiseCatchError } from 'src/utils/utils';
import { DatabaseError } from 'src/utils/app.errors';
import { BrandNotExists, ExistParkedVehicleWithinThatBrand } from './brand.errors';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepo: Repository<Brand>
    ) {}

    async getActiveBrands(): Promise<Brand[]> {
        try {
            const brands = this.brandRepo
                .createQueryBuilder('brand')
                    .leftJoinAndSelect('brand.models', 'model')
                    .leftJoinAndSelect('model.vehicleType', 'vehicleType')
                .getMany();
    
            return brands;
        } catch (err) {
            console.log(err);
            throw new DatabaseError();
        }
    }

    async deleteBrand(idBrand: number): Promise<void> {
        // Check if exists car parked
        const [pServiceError, existParkedVehicles] = await promiseCatchError(this.brandRepo
            .exists({ where: {
                idBrand: idBrand,
                models: { vehicles: {
                    parkingServices: {
                        isParking: true
                    }
                }}
            }})
        );
        if(pServiceError) throw new DatabaseError();
        if(existParkedVehicles)
            throw new ExistParkedVehicleWithinThatBrand();

        try {
            await promiseCatchError(this.brandRepo.delete(idBrand))
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
