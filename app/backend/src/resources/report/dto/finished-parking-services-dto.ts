import { IsDateString, IsDefined, IsNumber, IsObject, IsOptional, IsString, IsUppercase, MaxLength } from "class-validator";

export class FinishedParkingServices {
    @IsDefined()
    @IsString()
    @IsUppercase()
    @MaxLength(20)
    readonly plate: string;

    @IsDefined()
    @IsString()
    readonly brandModelYear: string;

    @IsOptional()
    @IsString()
    readonly clientName: string;

    @IsDefined()
    @IsDateString()
    readonly dateParkingServiceStart: string;
    
    @IsDefined()
    @IsDateString()
    readonly dateParkingServiceEnd: string;

    @IsDefined()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @IsObject()
    readonly ticketModel: object;
}