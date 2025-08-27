import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetActiveAgreementsDto {
    // idEmpresa
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    readonly idClient?: number;

    // data expiracao
    @IsOptional()
    @IsDateString()
    readonly dateExpirationStart?: string;

    @IsOptional()
    @IsDateString()
    readonly dateExpirationEnd?: string;
}