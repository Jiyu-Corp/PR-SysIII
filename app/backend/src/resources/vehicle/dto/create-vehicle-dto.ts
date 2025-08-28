import { PartialType } from "@nestjs/mapped-types";
import { IsDefined, IsNumber, IsObject, IsOptional, IsPositive, IsString, IsUppercase, Max, MaxLength, Min, MinLength, ValidateBy, ValidateNested } from "class-validator";
import { CreateModelDto } from "../modules/model/dto/create-model-dto";
import { Type } from "class-transformer";
import { ValidateFn } from "src/decorators/validateBy.decorator";

class CreateVehicleModelDto extends PartialType(CreateModelDto) {
	@IsOptional()
	@IsNumber()
	@IsPositive()
	readonly idModel?: number
}

export class CreateVehicleDto {
	//Placa
	@IsDefined({ message: "Placa é obrigatorio." })
	@IsString({ message: "Placa esta fora de padrão." })
	@IsUppercase({ message: "Todas as letras da placa devem estar em maiusculo." })
	@MinLength(7, { message: "Placa esta fora de padrão." })
	@MaxLength(20, { message: "Placa esta fora de padrão." })
	readonly plate: string

	//Modelo, Marca, Tipo Veiculo
	@IsDefined({ message: "Modelo é obrigatorio." })
	@IsObject({ message: "Modelo esta fora de padrão." })
	@ValidateNested()
	@Type(() => CreateVehicleModelDto)
	readonly model: CreateVehicleModelDto
	
	//Ano
	@IsOptional()
	@IsNumber({}, { message: "O ano esta fora de padrão." })
	@Min(1800, { message: "O ano minimo é 1800." })
	@ValidateFn((year: number) => {
		const currentYear = new Date().getFullYear();
		return year <= currentYear;
	}, "O ano não pode ultrapassar o atual.")
	readonly year?: number
	
	//Cor
	@IsOptional()
	@IsString({ message: "Cor esta fora de padrão." })
	@MaxLength(50)
	readonly color?: string
	
	//idCliente
	@IsOptional()
	@IsNumber()
	@IsPositive()
	idClient?: number | null

}