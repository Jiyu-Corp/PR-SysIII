import { Module } from '@nestjs/common';
import { AccessModule } from './access/access.module';
import { ClientModule } from './client/client.module';
import { ParkingServiceModule } from './parking-service/parking-service.module';
import { ReportModule } from './report/report.module';
import { TicketModelModule } from './ticket-model/ticket-model.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
    imports: [
        AccessModule,
        ClientModule,
        ParkingServiceModule,
        ReportModule,
        TicketModelModule,
        VehicleModule
    ],
})
export class ResourceModule {}
