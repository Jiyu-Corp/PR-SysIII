import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetActivePriceTablesDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    readonly idVehicleType?: number;

    @IsOptional()
    @IsDateString()
    readonly dateRegisterStart?: string;

    @IsOptional()
    @IsDateString()
    readonly dateRegisterEnd?: string;
}