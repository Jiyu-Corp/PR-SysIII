import { IsDefined, IsString } from "class-validator";

export class ServiceValueDto {
    @IsDefined()
    @IsString()
    readonly value: number;
    
    @IsDefined()
    @IsString()
    readonly description: string;
}