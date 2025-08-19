import { IsDateString, IsOptional, IsString } from "class-validator";

export class GetTicketModelsDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsDateString()
    readonly dateRegisterStart?: string;

    @IsOptional()
    @IsDateString()
    readonly dateRegisterEnd?: string;
}