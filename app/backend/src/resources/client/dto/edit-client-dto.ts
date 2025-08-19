import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client-dto";
import { IsDefined, IsNumber, IsPositive } from "class-validator";

export class EditClientDto extends PartialType(CreateClientDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idClient: number;
}