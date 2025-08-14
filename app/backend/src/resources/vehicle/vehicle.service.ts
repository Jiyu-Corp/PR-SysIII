import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle-dto';
import { EditVehicleDto } from './dto/edit-vehicle-dto';
import { Vehicle } from './vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { GetVehiclesDto } from './dto/get-vehicles-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { VehicleNotExists, VehiclePlateExists } from './vehicle.errors';

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
        try {
            const model = createVehicleDto.model;
            const vehicleData = this.vehicleRepo.create({
                plate: createVehicleDto.plate,
                year: createVehicleDto.year,
                color: createVehicleDto.color,
                client: {
                    idClient: createVehicleDto.idClient
                },
                model: typeof model.idModel !== 'undefined' 
                    ? { idModel: model.idModel }
                    : {
                        name: model.nameModel,
                        brand: typeof model.idBrand !== 'undefined'
                            ? { idBrand: model.idBrand }
                            : {
                                name: model.brand!.nameBrand,        
                            },
                        vehicleType: {
                            idVehicleType: model.idVehicleType
                        }
                    }
            });
            const vehicle = await this.vehicleRepo.save(vehicleData);

            return vehicle;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new VehiclePlateExists()
                ]
            })
        }
    }
    
    async editVehicle(idVehicle: number, editVehicleDto: EditVehicleDto): Promise<Vehicle> {
        const model = editVehicleDto.model!;
        const [loadError, vehicleData] = await promiseCatchError(this.vehicleRepo.preload({
            idVehicle: idVehicle,
            ... {
                plate: editVehicleDto.plate,
                year: editVehicleDto.year,
                color: editVehicleDto.color,
                client: {
                    idClient: editVehicleDto.idClient
                },
                model: typeof model.idModel !== 'undefined' 
                    ? { idModel: model.idModel }
                    : {
                        name: model.nameModel,
                        brand: typeof model.idBrand !== 'undefined'
                            ? { idBrand: model.idBrand }
                            : {
                                name: model.brand!.nameBrand,        
                            },
                        vehicleType: {
                            idVehicleType: model.idVehicleType
                        }
                    }
            }
        }));
        
        if(loadError)
            throw buildDatabaseError(loadError, {
                UKErrors: [
                    new VehiclePlateExists()
                ]
            });
        
        if(typeof vehicleData === 'undefined') throw new VehicleNotExists();

        try {
            const updatedVehicle = await this.vehicleRepo.save(vehicleData);
            
            return updatedVehicle;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async deleteVehicle(idVehicle: number): Promise<void> {
        const [vehicleError, result] = await promiseCatchError(this.vehicleRepo
            .update(idVehicle, { isActive: false })
        );
        if(vehicleError) throw new DatabaseError();
        if(result.affected === 0) throw new VehicleNotExists();
    }
}
