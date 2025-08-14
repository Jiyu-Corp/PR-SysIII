import { PartialType } from "@nestjs/mapped-types";
import { IsDefined, IsNumber, IsObject, IsOptional, IsPositive, IsString, IsUppercase, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { CreateModelDto } from "../modules/model/dto/create-model-dto";
import { Type } from "class-transformer";

export class CreateVehicleDto {
	//Placa
	@IsDefined()
	@IsString()
	@IsUppercase()
	@MaxLength(20)
	readonly plate: string

	//Modelo, Marca, Tipo Veiculo
	@IsDefined()
	@IsObject()
	@ValidateNested()
	@Type(() => CreateVehicleModelDto)
	readonly model: CreateVehicleModelDto
	
	//Ano
	@IsOptional()
	@IsNumber()
	@Min(1800)
	@Max(9999)
	readonly year?: number
	
	//Cor
	@IsOptional()
	@IsString()
	@MaxLength(50)
	readonly color?: string
	
	//idCliente
	@IsOptional()
	@IsNumber()
	@IsPositive()
	idClient?: number

}

class CreateVehicleModelDto extends PartialType(CreateModelDto) {
	@IsOptional()
	@IsNumber()
	@IsPositive()
	readonly idModel?: number
}