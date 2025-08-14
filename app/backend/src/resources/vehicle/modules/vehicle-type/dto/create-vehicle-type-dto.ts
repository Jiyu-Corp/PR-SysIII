import { IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateVehicleTypeDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idImage: number;
}