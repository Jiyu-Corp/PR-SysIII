import { PartialType } from "@nestjs/mapped-types";
import { CreatePriceTableDto } from "./create-price-table-dto";
import { IsDefined, IsNumber, IsObject, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EditPriceTableHourDto } from "../modules/price-table-hour/dto/edit-price-table-hour-dto";

export class EditPriceTableDto extends PartialType(CreatePriceTableDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idPriceTable: number;

    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => EditPriceTableHourDto)
    readonly priceTableHours?: Array<EditPriceTableHourDto>
}