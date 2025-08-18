import { Module } from '@nestjs/common';
import { PriceTableHourService } from './price-table-hour.service';
import { PriceTableHourController } from './price-table-hour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTableHour } from './price-table-hour.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PriceTableHour])],
    controllers: [PriceTableHourController],
    providers: [PriceTableHourService],
    exports: [PriceTableHourService]
})
export class PriceTableHourModule {}
