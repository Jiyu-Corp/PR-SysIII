import { IsDefined, IsNumber, IsObject, IsPositive, IsString, ValidateIf, ValidateNested } from "class-validator";
import { CreateBrandDto } from "../../brand/dto/create-brand-dto";
import { Type } from "class-transformer";

export class CreateModelDto {
	@ValidateIf((dto) => dto.brand == undefined)
	@IsDefined()
	@IsNumber()
	@IsPositive()
	readonly idBrand?: number

	@IsDefined({ message: "Marca do modelo é obrigatória." })
	@IsObject()
	@ValidateNested()
	@Type(() => CreateBrandDto)
	readonly brand?: CreateBrandDto

	@IsDefined({ message: "Tipo do veículo é obrigatório." })
	@IsNumber()
	@IsPositive()
	readonly idVehicleType: number

	@IsDefined({ message: "Nome do modelo é obrigatório." })
	@IsString()
	readonly nameModel: string
}