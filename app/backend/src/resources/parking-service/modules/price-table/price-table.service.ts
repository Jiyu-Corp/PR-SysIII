import { Injectable } from '@nestjs/common';
import { ParkingService } from '../../parking-service.entity';
import { ServiceValueDto } from '../../dto/service-value-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceTable } from './price-table.entity';
import { Repository } from 'typeorm';
import { GetActivePriceTablesDto } from './dto/get-active-price-tables-dto';
import { CreatePriceTableDto } from './dto/create-price-table-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { EditPriceTableDto } from './dto/edit-price-table-dto';
import { DatabaseError } from 'src/utils/app.errors';
import { ExistParkedVehicleWithinModelUsingThatPriceTable, PriceTableHourExists, PriceTableNotExists, PriceTableNotFound, PriceTableVehicleTypeExists } from './price-table.errors';
import { PriceTableHour } from './modules/price-table-hour/price-table-hour.entity';
import { EditPriceTableHourDto } from './modules/price-table-hour/dto/edit-price-table-hour-dto';

@Injectable()
export class PriceTableService {
    constructor(
        @InjectRepository(PriceTable)
        private readonly priceTableRepo: Repository<PriceTable>,
        @InjectRepository(PriceTableHour)
        private readonly priceTableHourRepo: Repository<PriceTableHour>
    ) {}

    async calculateServiceValue(parkingService: ParkingService): Promise<ServiceValueDto> {
        const [loadPTableError, priceTable] = await promiseCatchError(this.priceTableRepo.findOneBy({
            vehicleType: parkingService.vehicle.model.vehicleType,
            isActive: true
        }));
        if(loadPTableError) throw new DatabaseError();
        if(!priceTable) throw new PriceTableNotFound();

        const currentDate = new Date();
        const curDateWithTolerance = new Date(currentDate.getTime() - ((priceTable.toleranceMinutes ?? 0) * 1000 * 60));
        const timeOfServiceInMS = curDateWithTolerance.getTime() - parkingService.dateRegister.getTime();
        const hoursOfService = Math.floor(timeOfServiceInMS / (1000 * 60 * 60));

        // If tolerance make it negative, then the service was free
        if(hoursOfService < 0) {
          const serviceValue = {
            description: "Preço estadia",
            value: 0
          } as ServiceValueDto;
          
          return serviceValue;
        }
        
        const getServiceValueDescription = (hour: number) => `Preço estadia (${hour.toString()} Horas)`;
        const specialServiceHour = priceTable.priceTableHours && priceTable.priceTableHours.find(h => h.hour == hoursOfService);
        const serviceValue = {
            description: getServiceValueDescription(hoursOfService),
            value: specialServiceHour?.price || hoursOfService == 0 ? priceTable.pricePerHour : hoursOfService * priceTable.pricePerHour
        } as ServiceValueDto;

        return serviceValue;
    }

    async getActivePriceTables(getActivePriceTablesDto: GetActivePriceTablesDto): Promise<PriceTable[]> {
        try {  
            const query = this.priceTableRepo
                .createQueryBuilder('priceTable')
                    .innerJoinAndSelect('priceTable.vehicleType', 'vehicleType')
                    .leftJoinAndSelect('priceTable.priceTableHours', 'priceTableHours')
                .where('priceTable.isActive = :active', { active: true });
            
            if(getActivePriceTablesDto.idVehicleType) {
                query.andWhere('vehicleType.idVehicleType = :idVehicleType', { 
                    idVehicleType: getActivePriceTablesDto.idVehicleType 
                });
            }

            if(getActivePriceTablesDto.dateRegisterStart && getActivePriceTablesDto.dateRegisterEnd) {
                query.andWhere('priceTable.dateRegister BETWEEN :dateRegisterStart AND :dateRegisterEnd', { 
                    dateRegisterStart: getActivePriceTablesDto.dateRegisterStart,
                    dateRegisterEnd: getActivePriceTablesDto.dateRegisterEnd,
                })
            }
                
            const priceTable = await query.getMany();
            
            return priceTable;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async createPriceTable(createPriceTableDto: CreatePriceTableDto): Promise<PriceTable> {
        try {
            const priceTableData = this.priceTableRepo.create({
                pricePerHour: createPriceTableDto.pricePerHour,
                toleranceMinutes: createPriceTableDto.toleranceMinutes,
                vehicleType: {
                    idVehicleType: createPriceTableDto.idVehicleType
                },
                priceTableHours: typeof createPriceTableDto.priceTableHours !== 'undefined' // for some reason, that is not being saved...
                    ? createPriceTableDto.priceTableHours.map(pth => this.priceTableHourRepo.create({
                        hour: pth.hour,
                        price: pth.price
                    }))
                    : undefined
            });
            const priceTable = await this.priceTableRepo.save(priceTableData);

            return priceTable;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new PriceTableHourExists(),
                    new PriceTableVehicleTypeExists()
                ]
            })
        }
    }
    
    async editPriceTable(idPriceTable: number, editPriceTableDto: EditPriceTableDto): Promise<PriceTable> {
        const [loadError, priceTableData] = await promiseCatchError(this.priceTableRepo.preload({
            idPriceTable: idPriceTable,
            ... {
                pricePerHour: editPriceTableDto.pricePerHour,
                toleranceMinutes: editPriceTableDto.toleranceMinutes,
                vehicleType: {
                    idVehicleType: editPriceTableDto.idVehicleType
                },
                priceTableHours: typeof editPriceTableDto.priceTableHours !== 'undefined'
                    ? editPriceTableDto.priceTableHours.map(pth => this.priceTableHourRepo.create({
                        idPriceTableHour: pth.idPriceTableHour,
                        hour: pth.hour,
                        price: pth.price
                    }))
                    : undefined
            }
        }));
        
        if(loadError)
            throw new DatabaseError();
            
        if(typeof priceTableData === 'undefined') throw new PriceTableNotExists();

        try {
            const updatedPriceTable = await this.priceTableRepo.save(priceTableData);
            
            return updatedPriceTable;
        } catch (err) {
            console.log(err)
            throw buildDatabaseError(err, {
                UKErrors: [
                    new PriceTableHourExists(),
                    new PriceTableVehicleTypeExists()
                ]
            });
        }
    }

    async deletePriceTable(idPriceTable: number): Promise<void> {
        // Check if exists car parked
        const [pServiceError, existParkedVehiclesWithThatPriceTable] = await promiseCatchError(this.priceTableRepo
            .exists({ where: {
                idPriceTable: idPriceTable,
                vehicleType: { models: { vehicles: {
                    parkingServices: {
                        isParking: true
                    }
                }}}
            }})
        );
        if(pServiceError) throw new DatabaseError();
        if(existParkedVehiclesWithThatPriceTable)
            throw new ExistParkedVehicleWithinModelUsingThatPriceTable();

        const [priceTableError, result] = await promiseCatchError(this.priceTableRepo
            .update(idPriceTable, { isActive: false })
        );
        if(priceTableError) throw new DatabaseError();
        if(result.affected === 0) throw new PriceTableNotExists();
    }
}
