import { Controller } from '@nestjs/common';
import { PriceTableHourService } from './price-table-hour.service';

@Controller('price-table-hour')
export class PriceTableHourController {
  constructor(private readonly priceTableHourService: PriceTableHourService) {}
}
