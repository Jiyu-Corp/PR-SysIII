import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleTypeModule } from './modules/vehicle-type/vehicle-type.module';
import { ModelModule } from './modules/model/model.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vehicle]),
        BrandModule,
        ModelModule,
        VehicleTypeModule
    ],
    controllers: [VehicleController],
    providers: [VehicleService],
    exports: [VehicleService]
})
export class VehicleModule {}
