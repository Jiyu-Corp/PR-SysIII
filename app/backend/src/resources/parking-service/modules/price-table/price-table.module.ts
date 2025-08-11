import { Module } from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { PriceTableController } from './price-table.controller';

@Module({
  controllers: [PriceTableController],
  providers: [PriceTableService],
})
export class PriceTableModule {}
