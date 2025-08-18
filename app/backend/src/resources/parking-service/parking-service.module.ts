import { Module } from '@nestjs/common';
import { ParkingServiceService } from './parking-service.service';
import { ParkingServiceController } from './parking-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingService } from './parking-service.entity';
import { ParkModule } from './modules/park/park.module';
import { PriceTableModule } from './modules/price-table/price-table.module';
import { AgreementModule } from '../client/modules/agreement/agreement.module';
import { ClientModule } from '../client/client.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ParkingService]),
        ClientModule,
        VehicleModule,
        ParkModule,
        PriceTableModule,
        AgreementModule
    ],
    controllers: [ParkingServiceController],
    providers: [ParkingServiceService],
    exports: [ParkingServiceService]
})
export class ParkingServiceModule {}
