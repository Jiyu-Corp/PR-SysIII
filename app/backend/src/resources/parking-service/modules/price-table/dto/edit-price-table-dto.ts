import { PartialType } from "@nestjs/mapped-types";
import { CreatePriceTableDto } from "./create-price-table-dto";
import { IsArray, IsDefined, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EditPriceTableHourDto } from "../modules/price-table-hour/dto/edit-price-table-hour-dto";
import { CreatePriceTableHourDto } from "../modules/price-table-hour/dto/create-price-table-hour-dto";

export class EditPriceTableDto extends PartialType(CreatePriceTableDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idPriceTable: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EditPriceTableHourDto)
    readonly priceTableHours?: Array<EditPriceTableHourDto>
}