import { Module } from '@nestjs/common';
import { ParkingServiceService } from './parking-service.service';
import { ParkingServiceController } from './parking-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingService } from './parking-service.entity';
import { ParkModule } from './modules/park/park.module';
import { PriceTableModule } from './modules/price-table/price-table.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ParkingService]),
        ParkModule,
        PriceTableModule
    ],
    controllers: [ParkingServiceController],
    providers: [ParkingServiceService],
})
export class ParkingServiceModule {}
