import { PartialType } from "@nestjs/mapped-types";
import { CreateVehicleDto } from "./create-vehicle-dto";
import { IsDefined, IsEmpty, IsNumber, IsPositive } from "class-validator";

export class EditVehicleDto extends PartialType(CreateVehicleDto) {
	@IsDefined()
	@IsNumber()
	@IsPositive()
	readonly idVehicle: number
}

