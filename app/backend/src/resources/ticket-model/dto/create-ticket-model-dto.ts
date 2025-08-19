import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateTicketModelDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    readonly header: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    readonly footer: string;
}