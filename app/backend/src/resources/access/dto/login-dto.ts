import { IsDefined, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsDefined()
    @IsNotEmpty()
    readonly username: string;
    
    @IsDefined()
    @IsNotEmpty()
    readonly password: string;
}