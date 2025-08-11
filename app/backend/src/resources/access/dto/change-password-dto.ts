import { LoginDto } from "./login-dto";
import { PartialType } from '@nestjs/mapped-types';

export class ChangePasswordDto extends PartialType(LoginDto) {
    readonly username: string;
    readonly password: string;
    readonly newPassword: string;
}