import { IsDateString, IsDefined, IsNumber, IsPositive, Max, Min, ValidateIf } from "class-validator";

export class CreateAgreementDto {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idClient: number;

    @ValidateIf((dto) => dto.fixDiscount === undefined)
    @IsDefined()
    @IsNumber()
    @Min(0)
    @Max(100)
    readonly percentageDiscount?: number;

    @ValidateIf((dto) => dto.percentageDiscount === undefined)
    @IsDefined()
    @IsNumber()
    @Min(0)
    readonly fixDiscount?: number;

    @IsDefined()
    @IsDateString()
    readonly dateExpiration: string;
}