import { PartialType } from "@nestjs/mapped-types";
import { CreateTicketModelDto } from "./create-ticket-model-dto";
import { IsDefined, IsNumber, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class EditTicketModelDto extends PartialType(CreateTicketModelDto) {
    @IsDefined()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    readonly idTicketModel: number;
}