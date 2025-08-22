import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator'

export class GetActiveClientsDto {
    @IsOptional()
    @IsString()
    readonly cpfCnpj?: string;

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    readonly idClientType?: number;
}