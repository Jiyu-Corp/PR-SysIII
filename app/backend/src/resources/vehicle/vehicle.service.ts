import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle-dto';
import { EditVehicleDto } from './dto/edit-vehicle-dto';
import { Vehicle } from './vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { GetActiveVehiclesDto } from './dto/get-active-vehicles-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { VehicleIsParked, VehicleNotExists, VehiclePlateExists } from './vehicle.errors';

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepo: Repository<Vehicle>
    ) {}

    async getActiveVehicles(getActiveVehiclesDto: GetActiveVehiclesDto): Promise<Vehicle[]> {
        try {  
            // const vehicles = this.vehicleRepo.find({ where: {
            //     plate: getActiveVehiclesDto.plate,
            //     isActive: true,
            //     model: {
            //         idModel: getActiveVehiclesDto.idModel,
            //         brand: {
            //             idBrand: getActiveVehiclesDto.idBrand
            //         },
            //         vehicleType: {
            //             idVehicleType: getActiveVehiclesDto.idVehicleType
            //         },
            //     },
            //     client: {
            //         idClient: getActiveVehiclesDto.idClient
            //     }
            // }, relations: {
            //     client: true,
            //     model: {
            //         brand: true,
            //         vehicleType: true
            //     }
            // }});
            const query = this.vehicleRepo
                .createQueryBuilder('vehicle')
                    .leftJoinAndSelect('vehicle.model', 'model')
                    .leftJoinAndSelect('model.brand', 'brand')
                    .leftJoinAndSelect('model.vehicleType', 'vehicleType', 'vehicleType.isActive = true')
                    .leftJoinAndSelect('vehicle.client', 'client', 'client.isActive = true')
                .where('vehicle.isActive = true');
            
            if(typeof getActiveVehiclesDto.plate !== 'undefined')
                query.andWhere('vehicle.plate ILIKE :plate', { plate: `%${getActiveVehiclesDto.plate}%` });

            if(typeof getActiveVehiclesDto.idModel !== 'undefined')
                query.andWhere('model.idModel = :idModel', { idModel: getActiveVehiclesDto.idModel });

            if(typeof getActiveVehiclesDto.idBrand !== 'undefined')
                query.andWhere('brand.idBrand = :idBrand', { idBrand: getActiveVehiclesDto.idBrand });

            if(typeof getActiveVehiclesDto.idVehicleType !== 'undefined')
                query.andWhere('vehicleType.idVehicleType = :idVehicleType', { idVehicleType: getActiveVehiclesDto.idVehicleType });

            if(typeof getActiveVehiclesDto.idClient !== 'undefined')
                query.andWhere('client.idClient = :idClient', { idClient: getActiveVehiclesDto.idClient });

            const vehicles = await query.getMany();
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
            throw new DatabaseError();
            
        
        if(typeof vehicleData === 'undefined') throw new VehicleNotExists();

        try {
            const updatedVehicle = await this.vehicleRepo.save(vehicleData);
            
            return updatedVehicle;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new VehiclePlateExists()
                ]
            });
        }
    }

    async deleteVehicle(idVehicle: number): Promise<void> {
        // Check if exists car parked
        const [pServiceError, existParkedVehicles] = await promiseCatchError(this.vehicleRepo
            .exists({ where: {
                parkingServices: {
                    isParking: true
                }
            }})
        );
        if(pServiceError) throw new DatabaseError();
        if(existParkedVehicles)
            throw new VehicleIsParked();

        const [vehicleError, result] = await promiseCatchError(this.vehicleRepo
            .update(idVehicle, { isActive: false })
        );
        if(vehicleError) throw new DatabaseError();
        if(result.affected === 0) throw new VehicleNotExists();
    }
}
