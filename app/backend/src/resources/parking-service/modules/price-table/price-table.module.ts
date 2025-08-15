import { Module } from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { PriceTableController } from './price-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTable } from './price-table.entity';
import { PriceTableHourModule } from './modules/price-table-hour/price-table-hour.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PriceTable]),
        PriceTableHourModule
    ],
    controllers: [PriceTableController],
    providers: [PriceTableService],
})
export class PriceTableModule {}
