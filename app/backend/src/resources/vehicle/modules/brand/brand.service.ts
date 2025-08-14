import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { Repository } from 'typeorm';
import { promiseCatchError } from 'src/utils/utils';
import { DatabaseError } from 'src/utils/app.errors';
import { BrandNotExists } from './brand.errors';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepo: Repository<Brand>
    ) {}

    async getActiveBrands(): Promise<Brand[]> {
        const brands = this.brandRepo
            .createQueryBuilder('brand')
                .leftJoinAndSelect('brand.models', 'model', 'model.isActive = :modelActive', { modelActive: true })
                .leftJoinAndSelect('model.vehicleType', 'vehicleType')
            .where('brand.isActive = :brandActive', { brandActive: true })
            .getMany();

        return brands;
    }

    async deleteBrand(idBrand: number): Promise<void> {
        const [brandError, brandData] = await promiseCatchError(this.brandRepo.preload({
            idBrand: idBrand,
            isActive: false
        }));
        if(brandError) throw new DatabaseError();
        if(typeof brandData === 'undefined') throw new BrandNotExists();
        
        brandData.models.forEach(m => m.isActive = false);

        try {
            await this.brandRepo.save(brandData);
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
