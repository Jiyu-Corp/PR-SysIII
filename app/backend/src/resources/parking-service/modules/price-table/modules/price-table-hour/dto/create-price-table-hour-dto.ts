import { IsDefined, IsNumber, Min } from "class-validator";

export class CreatePriceTableHourDto {
    @IsDefined({ message: "A hora para cada horario especial é obrigatório." })
    @IsNumber({}, { message: "A hora para um horario especial esta fora do padrão." })
    @Min(1, { message: "A hora para um horario especial não pode ser negativo nem zero." })
    readonly hour: number;

    @IsDefined({ message: "O preço para cada hora especial é obrigatório." })
    @IsNumber({}, { message: "O preço para hora especial esta fora de padrão." })
    @Min(0, { message: "O preço para hora especial não pode ser negativo." })
    readonly price: number;
}