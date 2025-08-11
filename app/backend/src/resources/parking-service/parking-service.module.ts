import { Module } from '@nestjs/common';
import { ParkingServiceService } from './parking-service.service';
import { ParkingServiceController } from './parking-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingService } from './parking-service.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ParkingService])
    ],
    controllers: [ParkingServiceController],
    providers: [ParkingServiceService],
})
export class ParkingServiceModule {}
