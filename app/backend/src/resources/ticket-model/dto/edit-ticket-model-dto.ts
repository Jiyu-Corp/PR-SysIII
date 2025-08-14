import { PartialType } from "@nestjs/mapped-types";
import { CreateTicketModelDto } from "./create-ticket-model-dto";
import { IsDefined, IsNumber, IsPositive } from "class-validator";

export class EditTicketModelDto extends PartialType(CreateTicketModelDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idTicketModel: number;
}