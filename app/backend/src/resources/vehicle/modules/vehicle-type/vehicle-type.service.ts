import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleType } from './vehicle-type.entity';
import { Repository } from 'typeorm';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type-dto';
import { EditVehicleTypeDto } from './dto/edit-vehicle-type-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { DatabaseError } from 'src/utils/app.errors';
import { ExistParkedVehicleWithinModelUsingThatVehicleType, VehicleTypeDescriptionExists, VehicleTypeNotExists } from './vehicle-type.errors';

@Injectable()
export class VehicleTypeService {
    constructor(
        @InjectRepository(VehicleType)
        private readonly vehicleTypeRepo: Repository<VehicleType>
    ) {}

    async getActiveVehicleTypes(): Promise<VehicleType[]> {
        try {  
            const vehicleTypes = await this.vehicleTypeRepo.find({where: {
                isActive: true
            }});
            
            return vehicleTypes;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async createVehicleType(createVehicleTypeDto: CreateVehicleTypeDto): Promise<VehicleType> {
        try {
            const vehicleTypeData = this.vehicleTypeRepo.create(createVehicleTypeDto);
            const vehicleType = await this.vehicleTypeRepo.save(vehicleTypeData);

            return vehicleType;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new VehicleTypeDescriptionExists()
                ]
            })
        }
    }
    
    async editVehicleType(idVehicleType: number, editVehicleTypeDto: EditVehicleTypeDto): Promise<VehicleType> {
        const [loadError, vehicleTypeData] = await promiseCatchError(this.vehicleTypeRepo.preload({
            idVehicleType: idVehicleType,
            ... {
                description: editVehicleTypeDto.description,
                idImage: editVehicleTypeDto.idImage
            }
        }));
        
        if(loadError)
            throw new DatabaseError();
            
        if(typeof vehicleTypeData === 'undefined') throw new VehicleTypeNotExists();

        try {
            const updatedVehicleType = await this.vehicleTypeRepo.save(vehicleTypeData);
            
            return updatedVehicleType;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new VehicleTypeDescriptionExists()
                ]
            });
        }
    }

    async deleteVehicleType(idVehicleType: number): Promise<void> {
        // Check if exists car parked
        const [pServiceError, existParkedVehiclesWithThatVehicleType] = await promiseCatchError(this.vehicleTypeRepo
            .exists({ where: {
                models: { vehicles: {
                    parkingServices: {
                        isParking: true
                    }
                }}
            }})
        );
        if(pServiceError) throw new DatabaseError();
        if(existParkedVehiclesWithThatVehicleType)
            throw new ExistParkedVehicleWithinModelUsingThatVehicleType();

        const [vehicleTypeError, result] = await promiseCatchError(this.vehicleTypeRepo
            .update(idVehicleType, { isActive: false })
        );
        if(vehicleTypeError) throw new DatabaseError();
        if(result.affected === 0) throw new VehicleTypeNotExists();
    }
}
