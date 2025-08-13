import { IsNumber, IsOptional, IsPositive, IsString, IsUppercase, Length, MaxLength } from "class-validator";

export class GetVehiclesDto {
	// placa
	@IsOptional()
	@IsString()
	@IsUppercase()
	@MaxLength(20)
	readonly plate?: string;

	// marca
	@IsOptional()
	@IsNumber()
	@IsPositive()
	readonly idBrand?: number;

	// modelo
	@IsOptional()
	@IsNumber()
	@IsPositive()
	readonly idModel?: number
	
	// tipo de veiculo
	@IsOptional()
	@IsNumber()
	@IsPositive()
	readonly idVehicleType?: number
	
	// nome cliente 
	@IsOptional()
	@IsNumber()
	@IsPositive()
	readonly idClient?: number
}