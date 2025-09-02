import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingService } from './parking-service.entity';
import { FindOptionsWhere, Repository, TypeORMError } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { CreateParkingServiceDto } from './dto/create-parking-service-dto';
import { CreateVehicleDto } from '../vehicle/dto/create-vehicle-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { VehicleService } from '../vehicle/vehicle.service';
import { CreateClientDto } from '../client/dto/create-client-dto';
import { ClientService } from '../client/client.service';
import { Client } from '../client/client.entity';
import { ParkService } from './modules/park/park.service';
import { ServiceValueDto } from './dto/service-value-dto';
import { PriceTableService } from './modules/price-table/price-table.service';
import { ParkingServiceNotExists, VehicleAlreadyParked, VehicleWithoutModel } from './parking-service.errors';
import { AgreementService } from '../client/modules/agreement/agreement.service';
import { EditVehicleDto } from '../vehicle/dto/edit-vehicle-dto';
import { EditClientDto } from '../client/dto/edit-client-dto';
import { FinishParkingServiceDto } from './dto/finish-parking-service-dto';

@Injectable()
export class ParkingServiceService {
    constructor(
        @InjectRepository(ParkingService)
        private readonly parkingServiceRepo: Repository<ParkingService>,
        private readonly clientService: ClientService,
        private readonly vehicleService: VehicleService,
        private readonly parkService: ParkService,
        private readonly priceTableService: PriceTableService,
        private readonly agreementService: AgreementService
    ) {}

    async getOpenServices(): Promise<ParkingService[]> {
        try {
            const services = await this.parkingServiceRepo
                .find({
                    order: {
                        dateRegister: "DESC"
                    },
                    where: {
                        isParking: true
                    },
                    relations: {
                        clientEntry: {
                            clientEnterprise: true
                        },
                        vehicle: {
                            model: {
                                brand: true,
                                vehicleType: true
                            },
                        }
                    }
                });
            
            return services;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    // I could create all the nested objects with the create itself in the parking service, but i dont known if that would be ideal
    async createService(createParkingServiceDto: CreateParkingServiceDto): Promise<ParkingService> {
        const [parkError, park] = await promiseCatchError(this.parkService.getDefaultPark());
        if(parkError) throw parkError;

        const clientDto = createParkingServiceDto.clientCreate || createParkingServiceDto.clientEdit;
        const vehicleDto = (createParkingServiceDto.vehicleCreate || createParkingServiceDto.vehicleEdit)!;
        
        let client: Client | undefined;
        if(clientDto) {
            let clientError;
            
            [clientError, client] = await promiseCatchError(!("idClient" in clientDto)
                ? this.clientService.createClient(clientDto as CreateClientDto)
                : this.clientService.editClient((clientDto as EditClientDto).idClient, clientDto as EditClientDto)
            );
            if(clientError || typeof client === 'undefined') throw clientError;
            
            vehicleDto.idClient = client.idClient;
        } else {
          vehicleDto.idClient = null;
        }
  
        const [vehicleError, vehicle] = await promiseCatchError(!("idVehicle" in vehicleDto)
            ? this.vehicleService.createVehicle(vehicleDto as CreateVehicleDto)
            : this.vehicleService.editVehicle((vehicleDto as EditVehicleDto).idVehicle, vehicleDto as EditVehicleDto)
        );
        if(client && (vehicleError || vehicle.model === null)) 
            this.clientService.deleteClient(client.idClient); // Delete created client if vehicle creation didnt worked 

        if(vehicleError) throw vehicleError;
        if(vehicle.model === null) 
            throw new VehicleWithoutModel(); // Maybe that will never happen because the handlers of create/edit vehicle

        try {
            const serviceData = await this.parkingServiceRepo.create({
                park: park,
                clientEntry: client,
                vehicle: vehicle
            });
            const service = await this.parkingServiceRepo.save(serviceData);

            return service;
        } catch (err) {
            if(client) this.clientService.deleteClient(client.idClient);
            this.vehicleService.deleteVehicle(vehicle.idVehicle);

            throw buildDatabaseError(err, {
                UKErrors: [
                    new VehicleAlreadyParked()
                ]
            });
        }
    }

    async getServiceValues(idParkingService: number): Promise<ServiceValueDto[]> {
        const [pServiceError, service] = await promiseCatchError(this.parkingServiceRepo
            .createQueryBuilder('parkingService')
                .leftJoinAndSelect('parkingService.clientEntry', 'clientEntry')
                .leftJoinAndSelect('clientEntry.agreements', 'agreement', 
                    'agreement.isActive = true'
                )
                .innerJoinAndSelect('parkingService.vehicle', 'vehicle')
                .leftJoinAndSelect('vehicle.client', 'client', 'client.isActive = true')
                .leftJoinAndSelect('client.agreements', 'vClientAgreement', 'vClientAgreement.isActive = true')
                .innerJoinAndSelect('vehicle.model', 'model')
                .innerJoinAndSelect('model.brand', 'brand')
                .innerJoinAndSelect('model.vehicleType', 'vehicleType')
            .where('parkingService.idParkingService = :idParkingService', { idParkingService })
            .getOne()
        );
        if(pServiceError) throw new DatabaseError();
        if(service == null) throw new ParkingServiceNotExists();

        const serviceValues:ServiceValueDto[] = new Array();

        const [pTableError, priceTableValue] = await promiseCatchError(
            this.priceTableService.calculateServiceValue(service)
        );
        if(pTableError) throw pTableError;
        serviceValues.push(priceTableValue);

        // Client of entrance has priority compared to the client binded to the vehicle
        const client = service.clientEntry || service.vehicle.client;

        const agreement = client && client.agreements && client.agreements[0];
        if(agreement) {
            const [agreementError, agreementDiscount] = await promiseCatchError(
                this.agreementService.calculateServiceDiscount(agreement, priceTableValue.value)
            );
            if(agreementError) throw agreementError;

            serviceValues.push(agreementDiscount);
        }

        return serviceValues;
    }

    async cancelService(idParkingService: number): Promise<void> {
        const [pServiceError, service] = await promiseCatchError(this.parkingServiceRepo
            .update(idParkingService, { isParking: false })
        );
        if(pServiceError) throw new DatabaseError();
        if(service.affected === 0) throw new ParkingServiceNotExists();
    }

    async finishService(finishParkingServiceDto: FinishParkingServiceDto): Promise<void> {
        const [pServiceError, parkingService] = await promiseCatchError(this.parkingServiceRepo
            .createQueryBuilder('parkingService')
                .leftJoinAndSelect('parkingService.clientEntry', 'clientEntry')
                .leftJoinAndSelect('clientEntry.agreements', 'agreement', 
                    'agreement.isActive = true'
                )
                .innerJoinAndSelect('parkingService.vehicle', 'vehicle')
                .leftJoinAndSelect('vehicle.client', 'client', 'client.isActive = true')
                .leftJoinAndSelect('client.agreements', 'vClientAgreement', 'vClientAgreement.isActive = true')
                .innerJoinAndSelect('vehicle.model', 'model')
                .innerJoinAndSelect('model.brand', 'brand')
                .innerJoinAndSelect('model.vehicleType', 'vehicleType')
                .innerJoinAndSelect('vehicleType.priceTables', 'priceTable', 'priceTable.isActive = true')
            .where('parkingService.idParkingService = :idParkingService', { idParkingService: finishParkingServiceDto.idParkingService })
            .getOne());
        if(pServiceError) throw new DatabaseError();
        if(!parkingService) throw new ParkingServiceNotExists();

        const [sValuesError, serviceValues] = await promiseCatchError(this.getServiceValues(
            finishParkingServiceDto.idParkingService
        ));
        if(sValuesError) throw sValuesError;

        const serviceTotalCost = 
            serviceValues.reduce((acc, sCost) => acc+sCost.value, 0) + 
            (finishParkingServiceDto.additionalDiscount ?? 0);
        
        // Client of entrance has priority compared to the client binded to the vehicle
        const client = parkingService.clientEntry || parkingService.vehicle.client;
        const agreement = client && client.agreements && client.agreements[0];
        
        parkingService.priceTable = parkingService.vehicle.model.vehicleType.priceTables[0];
        parkingService.agreement = agreement;

        parkingService.price = serviceValues.find(v => v.description.includes("Preço estadia"))!.value;
        parkingService.discountAdditional = finishParkingServiceDto.additionalDiscount;
        parkingService.totalPrice = serviceTotalCost;

        parkingService.isParking = false;
        parkingService.dateCheckout = new Date();
    }
}
