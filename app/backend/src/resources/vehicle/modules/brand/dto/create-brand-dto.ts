import { IsDefined, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBrandDto {
	@IsDefined()
	@IsString()
	readonly nameBrand: string
}