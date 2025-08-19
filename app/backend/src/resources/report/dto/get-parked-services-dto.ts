import { IsDateString, IsOptional, IsString, IsUppercase, MaxLength } from "class-validator";

export class GetParkedServicesDto {
    @IsOptional()
    @IsString()
    @IsUppercase()
    @MaxLength(20)
    readonly plate?: string;

    @IsOptional()
    @IsString()
    readonly clientName?: string;

    @IsOptional()
    @IsDateString()
    readonly dateStart?: string;

    @IsOptional()
    @IsDateString()
    readonly dateEnd?: string;
}