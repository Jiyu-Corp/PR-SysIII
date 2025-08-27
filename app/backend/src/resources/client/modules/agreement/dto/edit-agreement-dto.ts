import { PartialType } from "@nestjs/mapped-types";
import { CreateAgreementDto } from "./create-agreement-dto";
import { IsDefined, IsNumber, IsPositive, Max, Min, ValidateIf } from "class-validator";

export class EditAgreementDto extends PartialType(CreateAgreementDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idAgreement: number;

    @ValidateIf((dto) => dto.fixDiscount == undefined)
    @IsDefined({ message: "Porcentagem de desconto é obrigatoria na ausencia do desconto fixo." })
    @IsNumber({}, { message: "Porcentagem de desconto esta fora de padrão." })
    @Min(0, { message: "Porcentagem de desconto deve ser no minimo 0." })
    @Max(100, { message: "Porcentagem de desconto deve ser no maximo 100." })
    readonly percentageDiscount?: number;

    @ValidateIf((dto) => dto.percentageDiscount == undefined)
    @IsDefined({ message: "Desconto fixo é obrigatorio na ausencia do desconto percentual." })
    @IsNumber({}, { message: "Desconto fixo esta fora de padrão." })
    @Min(0, { message: "Desconto fixo deve ser no minimo 0." })
    readonly fixDiscount?: number;
}