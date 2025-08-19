import { IsDefined, IsNumber, IsObject, IsPositive, IsString, ValidateIf, ValidateNested } from "class-validator";
import { CreateBrandDto } from "../../brand/dto/create-brand-dto";
import { Type } from "class-transformer";

export class CreateModelDto {
	@ValidateIf((dto) => dto.brand == undefined)
	@IsDefined()
	@IsNumber()
	@IsPositive()
	readonly idBrand?: number

	@IsDefined()
	@IsObject()
	@ValidateNested()
	@Type(() => CreateBrandDto)
	readonly brand?: CreateBrandDto

	@IsDefined()
	@IsNumber()
	@IsPositive()
	readonly idVehicleType: number

	@IsDefined()
	@IsString()
	readonly nameModel: string
}