import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleType } from './vehicle-type.entity';
import { Repository } from 'typeorm';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type-dto';
import { EditVehicleTypeDto } from './dto/edit-vehicle-type-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { DatabaseError } from 'src/utils/app.errors';
import { ExistModelsUsingThatVehicleType, ExistParkedVehicleWithinModelUsingThatVehicleType, VehicleTypeDescriptionExists, VehicleTypeNotExists } from './vehicle-type.errors';

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
        // Get vehicle type
        const [vTypeError, vehicleType] = await promiseCatchError(this.vehicleTypeRepo.findOne({where:{
            idVehicleType: idVehicleType
        }, relations: {
            models: true
        }}));
        if(vTypeError) throw new DatabaseError();
        if(vehicleType === null) throw new VehicleTypeNotExists();
        
        const existsModels = vehicleType.models.length < 1;
        if(existsModels) throw new ExistModelsUsingThatVehicleType();

        // Check if exists car parked
        if(existsModels) {
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
        }

        const vehicleTypeError = await promiseCatchError(this.vehicleTypeRepo
            .update(idVehicleType, { isActive: false })
        );
        if(vehicleTypeError) throw new DatabaseError();
    }
}
