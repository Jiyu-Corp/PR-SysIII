import { Type } from "class-transformer";
import { IsDefined, IsNumber, IsObject, IsOptional, IsPositive, ValidateIf, ValidateNested } from "class-validator";
import { CreateClientDto } from "src/resources/client/dto/create-client-dto";
import { EditClientDto } from "src/resources/client/dto/edit-client-dto";
import { CreateVehicleDto } from "src/resources/vehicle/dto/create-vehicle-dto";
import { EditVehicleDto } from "src/resources/vehicle/dto/edit-vehicle-dto";

export class FinishParkingServiceDto {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idParkingService: number;

    @IsOptional()
    @IsNumber()
    readonly additionalDiscount: number;
}