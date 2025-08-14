import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { PriceTable } from './price-table.entity';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { GetActivePriceTablesDto } from './dto/get-active-price-tables-dto';
import { CreatePriceTableDto } from './dto/create-price-table-dto';
import { EditPriceTableDto } from './dto/edit-price-table-dto';

@Controller('price-table')
export class PriceTableController {
    constructor(private readonly priceTableService: PriceTableService) {}

    @Get('')
    async getActivePriceTables(@Query() getActivePriceTablesDto: GetActivePriceTablesDto): Promise<PriceTable[]> {
        const [httpError, priceTables] = await promiseCatchErrorHTTPDefault(this.priceTableService.getActivePriceTables(getActivePriceTablesDto));
        if(httpError) throw httpError;
        
        return priceTables;
    }

    @Post('')
    async createPriceTable(@Body() createPriceTableDto: CreatePriceTableDto): Promise<PriceTable> {
        const [httpError, priceTable] = await promiseCatchErrorHTTPDefault(this.priceTableService.createPriceTable(createPriceTableDto));
        if(httpError) throw httpError;

        return priceTable;
    }

    @Put(':idPriceTable')
    async editPriceTable(@Param('idPriceTable') idPriceTable: number, @Body() editPriceTableDto: EditPriceTableDto): Promise<PriceTable> {
        const [httpError, priceTable] = await promiseCatchErrorHTTPDefault(this.priceTableService.editPriceTable(idPriceTable, editPriceTableDto));
        if(httpError) throw httpError;

        return priceTable;
    }

    @Delete(':idPriceTable')
    async deletePriceTable(@Param('idPriceTable') idPriceTable: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.priceTableService.deletePriceTable(idPriceTable));
        if(httpError) throw httpError;
    }
}
