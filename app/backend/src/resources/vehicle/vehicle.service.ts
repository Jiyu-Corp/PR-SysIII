import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle-dto';
import { EditVehicleDto } from './dto/edit-vehicle-dto';
import { Vehicle } from './vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { GetVehiclesDto } from './dto/get-vehicles-dto';

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepo: Repository<Vehicle>
    ) {}

    async getVehicles(getVehiclesDto: GetVehiclesDto): Promise<Vehicle[]> {
        try {
            const vehicles = this.vehicleRepo.find({ where: {
                plate: getVehiclesDto.plate,
                model: {
                    idModel: getVehiclesDto.idModel,
                    brand: {
                        idBrand: getVehiclesDto.idBrand
                    },
                    vehicleType: {
                        idVehicleType: getVehiclesDto.idVehicleType
                    },
                },
                client: {
                    idClient: getVehiclesDto.idClient
                }
            }, relations: {
                client: true,
                model: {
                    brand: true,
                    vehicleType: true
                }
            }});
            
            return vehicles;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        
    }
    
    async editVehicle(editVehicleDto: EditVehicleDto): Promise<Vehicle> {
        
    }
}
