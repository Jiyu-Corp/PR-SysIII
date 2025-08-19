import { PartialType } from "@nestjs/mapped-types";
import { CreateVehicleTypeDto } from "./create-vehicle-type-dto";
import { IsDefined, IsNumber, IsPositive } from "class-validator";

export class EditVehicleTypeDto extends PartialType(CreateVehicleTypeDto) {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    readonly idVehicleType: number;
}