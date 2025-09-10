import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateClientDto {
    @IsDefined({ message: "O nome é obrigatório." })
    @IsString({ message: "O nome é obrigatório." })
    @IsNotEmpty({ message: "O nome é obrigatório." })
    readonly name: string;

    @IsDefined({ message: "O CPF/CNPJ é obrigatório." })
    @IsString({ message: "O CPF/CNPJ é obrigatório." })
    @Matches(/^.{11}$|^.{14}$/, {
      message: 'O CPF/CNPJ esta incompleto.',
    })
    @IsNotEmpty({ message: "O CPF/CNPJ é obrigatório." })
    readonly cpfCnpj: string;

    @IsOptional()
    @IsString({ message: "O Email esta fora de padrão." })
    @IsEmail({}, { message: "O Email esta fora de padrão." })
    readonly email?: string;

    @IsOptional()
    @IsString({ message: "O telefone esta fora de padrão." })
    @IsNumberString({}, { message: "O telefone esta fora de padrão." })
    @Matches(/^.{10}$|^.{11}$/, {
      message: 'O telefone esta incompleto.',
    })
    readonly phone?: string;

    @IsOptional()
    @IsNumber()
    readonly idClientEnterprise?: number;
}