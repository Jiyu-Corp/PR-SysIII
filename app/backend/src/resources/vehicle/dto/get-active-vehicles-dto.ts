import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, IsUppercase, Length, MaxLength } from "class-validator";

export class GetActiveVehiclesDto {
	// placa
	@IsOptional()
	@IsString()
	@IsUppercase()
	@MaxLength(20)
	readonly plate?: string;

	// marca
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@IsPositive()
	readonly idBrand?: number;

	// modelo
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@IsPositive()
	readonly idModel?: number
	
	// tipo de veiculo
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@IsPositive()
	readonly idVehicleType?: number
	
	// nome cliente 
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@IsPositive()
	readonly idClient?: number
}