import { IsDefined, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBrandDto {
	@IsDefined({ message: "Nome da marca é obrigatória." })
	@IsString()
	readonly nameBrand: string
}