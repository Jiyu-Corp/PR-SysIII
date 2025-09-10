import { IsDefined, IsNotEmpty, IsNumber, isPositive, IsPositive, IsString } from "class-validator";

export class CreateVehicleTypeDto {
    @IsDefined({ message: "O nome do tipo é obrigatório." })
    @IsString({ message: "O nome do tipo esta fora de padrão." })
    @IsNotEmpty({ message: "O nome do tipo não pode estar vazia." })
    readonly description: string;

    @IsDefined({ message: "A imagem representativa é obrigatória." })
    @IsNumber({}, { message: "O identificador da imagem representativa esta fora de padrão." })
    @IsPositive({ message: "O identificador da imagem representativa esta fora de padrão." })
    readonly idImage: number;
}