import { Module } from '@nestjs/common';
import { ParkingServiceService } from './parking-service.service';
import { ParkingServiceController } from './parking-service.controller';

@Module({
  controllers: [ParkingServiceController],
  providers: [ParkingServiceService],
})
export class ParkingServiceModule {}
