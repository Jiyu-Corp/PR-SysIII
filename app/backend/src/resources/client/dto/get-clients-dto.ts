import { IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator'

export class GetClientsDto {
    @IsOptional()
    @IsString()
    @Length(11, 14)
    readonly cpfCnpj?: string;

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    readonly idClientType?: number;
}