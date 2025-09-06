import { IsDateString, IsDefined, IsNumber, IsOptional, IsString, IsUppercase, MaxLength } from "class-validator";

export class ParkedServicesDto {
    @IsDefined()
    @IsString()
    @IsUppercase()
    @MaxLength(20)
    readonly plate: string;

    @IsDefined()
    @IsString()
    readonly brandModelYear: string;

    @IsDefined()
    @IsDateString()
    readonly dateParkingServiceStart: string;

    @IsOptional()
    @IsString()
    readonly clientName: string;
}