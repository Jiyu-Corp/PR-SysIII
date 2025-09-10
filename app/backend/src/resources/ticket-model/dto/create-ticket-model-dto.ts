import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateTicketModelDto {
    @IsDefined({ message: "Nome do modelo é obrigatorio." })
    @IsString({ message: "Nome do modelo esta fora de padrão." })
    @IsNotEmpty({ message: "Nome do modelo é obrigatorio." })
    readonly name: string;

    @IsDefined({ message: "Cabeçalho é obrigatorio." })
    @IsString({ message: "Cabeçalho esta fora de padrão." })
    @IsNotEmpty({ message: "Cabeçalho é obrigatorio." })
    readonly header: string;

    @IsDefined({ message: "Rodapé é obrigatorio." })
    @IsString({ message: "Rodapé esta fora de padrão." })
    @IsNotEmpty({ message: "Rodapé é obrigatorio." })
    readonly footer: string;
}