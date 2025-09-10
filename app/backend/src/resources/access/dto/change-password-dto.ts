import { IsDefined, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";
import { LoginDto } from "./login-dto";
import { PartialType } from '@nestjs/mapped-types';

export class ChangePasswordDto extends PartialType(LoginDto) {
    @IsDefined({ message: "Login é obrigatório." })
    @IsString({ message: "Login esta fora de padrão." })
    readonly username: string;
    
    @IsDefined({ message: "Senha atual é obrigatória." })
    @IsString({ message: "Senha atual esta fora de padrão." })
    @IsNotEmpty({ message: "Senha atual não pode ser vazia." })
    readonly password: string;
    
    @IsDefined({ message: "Nova senha é obrigatória." })
    @IsString({ message: "Nova senha esta fora de padrão." })
    @IsNotEmpty({ message: "Nova senha não pode ser vazia." })
    @MinLength(8, { message: "Nova senha precisa ter no minímo 8 caracteres." })
    readonly newPassword: string;
}