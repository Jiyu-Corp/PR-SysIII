import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNumber, IsObject, IsOptional, IsPositive, Min, ValidateNested } from "class-validator";
import { CreatePriceTableHourDto } from "../modules/price-table-hour/dto/create-price-table-hour-dto";

export class CreatePriceTableDto {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idVehicleType: number;

    @IsDefined()
    @IsNumber()
    @Min(0)
    readonly pricePerHour: number;

    @IsDefined()
    @IsNumber()
    @Min(0)
    readonly toleranceMinutes: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePriceTableHourDto)
    readonly priceTableHours?: Array<CreatePriceTableHourDto>
} 