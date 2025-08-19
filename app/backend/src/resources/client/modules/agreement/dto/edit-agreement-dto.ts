import { PartialType } from "@nestjs/mapped-types";
import { CreateAgreementDto } from "./create-agreement-dto";
import { IsDefined, IsNumber, IsPositive } from "class-validator";

export class EditAgreementDto extends PartialType(CreateAgreementDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idAgreement: number;
}