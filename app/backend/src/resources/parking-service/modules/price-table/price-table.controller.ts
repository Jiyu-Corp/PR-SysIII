import { Controller } from '@nestjs/common';
import { PriceTableService } from './price-table.service';

@Controller('price-table')
export class PriceTableController {
  constructor(private readonly priceTableService: PriceTableService) {}
}
