import { Type } from "class-transformer";
import { IsDefined, IsObject, IsOptional, ValidateIf, ValidateNested } from "class-validator";
import { CreateClientDto } from "src/resources/client/dto/create-client-dto";
import { EditClientDto } from "src/resources/client/dto/edit-client-dto";
import { CreateVehicleDto } from "src/resources/vehicle/dto/create-vehicle-dto";
import { EditVehicleDto } from "src/resources/vehicle/dto/edit-vehicle-dto";

// VALIDATE ERRORS!!!
export class CreateParkingServiceDto {
    @ValidateIf(o => typeof o.clientCreate === 'undefined')
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => EditClientDto)
    readonly clientEdit?: EditClientDto;

    @ValidateIf(o => typeof o.clientEdit === 'undefined')
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateClientDto)
    readonly clientCreate?: CreateClientDto;

    @ValidateIf(o => typeof o.vehicleEdit === 'undefined')
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateVehicleDto)
    readonly vehicleCreate?: CreateVehicleDto;
    
    @ValidateIf(o => typeof o.vehicleCreate === 'undefined')
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => EditVehicleDto)
    readonly vehicleEdit?: EditVehicleDto;
}