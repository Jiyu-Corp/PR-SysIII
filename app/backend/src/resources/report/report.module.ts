import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingService } from '../parking-service/parking-service.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ParkingService])
    ],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}