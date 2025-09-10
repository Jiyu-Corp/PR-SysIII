import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNumber, IsObject, IsOptional, IsPositive, Min, ValidateNested } from "class-validator";
import { CreatePriceTableHourDto } from "../modules/price-table-hour/dto/create-price-table-hour-dto";

export class CreatePriceTableDto {
    @IsDefined({ message: "Tipo do veículo é obrigatório." })
    @IsNumber({}, { message: "Identificador do tipo do veículo esta fora de padrão." })
    @IsPositive({ message: "Identificador do tipo do veículo esta fora de padrão." })
    readonly idVehicleType: number;

    @IsDefined({ message: "Preço por hora é obrigatório." })
    @IsNumber({}, { message: "Preço por hora esta fora de padrão." })
    @Min(0, { message: "Preço não pode ser negativo." })
    readonly pricePerHour: number;

    @IsOptional()
    @IsNumber({}, { message: "Tempo de tolerância esta fora do padrão." })
    @Min(0, { message: "Tempo de tolerância não pode ser negativo." })
    readonly toleranceMinutes: number;

    @IsOptional()
    @IsArray({ message: "Horas especiais estão fora do padrão." })
    @ValidateNested({ each: true })
    @Type(() => CreatePriceTableHourDto)
    readonly priceTableHours?: Array<CreatePriceTableHourDto>
} 