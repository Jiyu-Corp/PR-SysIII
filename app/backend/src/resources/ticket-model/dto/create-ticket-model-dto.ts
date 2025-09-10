import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateTicketModelDto {
    @IsDefined({ message: "Nome do modelo é obrigatório." })
    @IsString({ message: "Nome do modelo esta fora de padrão." })
    @IsNotEmpty({ message: "Nome do modelo é obrigatório." })
    readonly name: string;

    @IsDefined({ message: "Cabeçalho é obrigatório." })
    @IsString({ message: "Cabeçalho esta fora de padrão." })
    @IsNotEmpty({ message: "Cabeçalho é obrigatório." })
    readonly header: string;

    @IsDefined({ message: "Rodapé é obrigatório." })
    @IsString({ message: "Rodapé esta fora de padrão." })
    @IsNotEmpty({ message: "Rodapé é obrigatório." })
    readonly footer: string;
}