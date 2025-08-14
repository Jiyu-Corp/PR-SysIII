import { Module } from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { PriceTableController } from './price-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTable } from './price-table.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PriceTable])
    ],
    controllers: [PriceTableController],
    providers: [PriceTableService],
})
export class PriceTableModule {}
