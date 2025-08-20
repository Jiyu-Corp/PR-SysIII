import { PartialType } from "@nestjs/mapped-types";
import { CreatePriceTableHourDto } from "./create-price-table-hour-dto";
import { IsDefined, IsNumber, IsOptional, IsPositive } from "class-validator";

export class EditPriceTableHourDto extends PartialType(CreatePriceTableHourDto) {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    readonly idPriceTableHour: number;

    // Maybe put the decorators from CreatePriceTableHourDto, maybe is needed
    readonly hour: number;

    readonly price: number;
}