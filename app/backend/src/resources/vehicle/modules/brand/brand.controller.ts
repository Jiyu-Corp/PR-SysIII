import { Controller, Delete, Get, Param } from '@nestjs/common';
import { BrandService } from './brand.service';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { Brand } from './brand.entity';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Get('getActiveBrands')
    async getActiveBrands(): Promise<Brand[]> {
        const [httpError, brands] = await promiseCatchErrorHTTPDefault(this.brandService.getActiveBrands());
        if(httpError) throw httpError;

        return brands;
    }

    @Delete(':idBrand')
    async deleteBrand(@Param('idBrand') idBrand: number): Promise<void> {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.brandService.deleteBrand(idBrand));
        if(httpError) throw httpError;
    }
}
