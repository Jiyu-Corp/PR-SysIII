import { Type } from "class-transformer";
import { IsDefined, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Client } from "src/resources/client/client.entity";
import { CreateClientDto } from "src/resources/client/dto/create-client-dto";
import { EditClientDto } from "src/resources/client/dto/edit-client-dto";
import { CreateVehicleDto } from "src/resources/vehicle/dto/create-vehicle-dto";
import { EditVehicleDto } from "src/resources/vehicle/dto/edit-vehicle-dto";
import { CreateBrandDto } from "src/resources/vehicle/modules/brand/dto/create-brand-dto";
import { Vehicle } from "src/resources/vehicle/vehicle.entity";

export class CreateParkingServiceDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateClientDto || EditClientDto)
    readonly clientDto?: CreateClientDto | EditClientDto;
    
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateVehicleDto || EditVehicleDto)
    readonly vehicleDto: CreateVehicleDto | EditVehicleDto;
}