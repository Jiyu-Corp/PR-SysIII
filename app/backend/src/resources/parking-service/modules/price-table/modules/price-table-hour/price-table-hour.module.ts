import { Module } from '@nestjs/common';
import { PriceTableHourService } from './price-table-hour.service';
import { PriceTableHourController } from './price-table-hour.controller';

@Module({
  controllers: [PriceTableHourController],
  providers: [PriceTableHourService],
})
export class PriceTableHourModule {}
