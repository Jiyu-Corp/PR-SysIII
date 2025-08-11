import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle-dto';
import { EditVehicleDto } from './dto/edit-vehicle-dto';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehicleService {
    async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        
    }
    
    async editVehicle(editVehicleDto: EditVehicleDto): Promise<Vehicle> {
        
    }
}
