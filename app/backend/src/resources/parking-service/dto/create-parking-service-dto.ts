import { Client } from "src/resources/client/client.entity";
import { CreateClientDto } from "src/resources/client/dto/create-client-dto";
import { EditClientDto } from "src/resources/client/dto/edit-client-dto";
import { CreateVehicleDto } from "src/resources/vehicle/dto/create-vehicle-dto";
import { EditVehicleDto } from "src/resources/vehicle/dto/edit-vehicle-dto";
import { Vehicle } from "src/resources/vehicle/vehicle.entity";

export class CreateParkingServiceDto {
    readonly clientDto?: CreateClientDto | EditClientDto;
    readonly vehicleDto: CreateVehicleDto | EditVehicleDto;
}