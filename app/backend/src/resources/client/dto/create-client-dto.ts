import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CreateClientDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsDefined()
    @IsString()
    @Length(11, 14)
    @IsNotEmpty()
    readonly cpfCnpj: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsString()
    @IsNumberString()
    @Length(10, 11)
    readonly phone?: string;

    @IsOptional()
    @IsNumber()
    readonly idClientEnterprise?: number;
}