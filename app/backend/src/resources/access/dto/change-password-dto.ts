import { IsDefined, IsString } from "class-validator";
import { LoginDto } from "./login-dto";
import { PartialType } from '@nestjs/mapped-types';

export class ChangePasswordDto extends PartialType(LoginDto) {
    @IsDefined()
    @IsString()
    readonly username: string;
    
    @IsDefined()
    @IsString()
    readonly password: string;
    
    @IsDefined()
    @IsString()
    readonly newPassword: string;
}