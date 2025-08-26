import { IsDateString, IsDefined, IsNumber, IsPositive, Max, Min, ValidateIf } from "class-validator";
import { ValidateFn } from "src/decorators/validateBy.decorator";

export class CreateAgreementDto {
    @IsDefined({ message: "Cliente é obrigatorio." })
    @IsNumber({}, { message: "Identificador do cliente esta fora de padrão." })
    @IsPositive({ message: "Identificador do cliente esta fora de padrão." })
    readonly idClient: number;

    @ValidateIf((dto) => dto.fixDiscount == undefined)
    @IsDefined({ message: "Porcentagem de desconto é obrigatoria na ausencia do desconto fixo." })
    @IsNumber({}, { message: "Porcentagem de desconto esta fora de padrão." })
    @Min(0, { message: "Porcentagem de desconto deve ser no minimo 0." })
    @Max(100, { message: "Porcentagem de desconto deve ser no maximo 100." })
    readonly percentageDiscount?: number;

    @ValidateIf((dto) => dto.percentageDiscount == undefined)
    @IsDefined({ message: "Desconto fixo é obrigatorio na ausencia do desconto percentual." })
    @IsNumber({}, { message: "Desconto fixo esta fora de padrão." })
    @Min(0, { message: "Desconto fixo deve ser no minimo 0." })
    readonly fixDiscount?: number;

    @IsDefined({ message: "Data de expiração do convenio é obrigatoria." })
    @IsDateString({}, { message: "Data de expiração esta fora de padrão." })
    @ValidateFn((date: string) => {
      const parsedDate = new Date(date);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      return parsedDate > yesterday;
    }, "Data de expiração não pode ser anterior a data atual.")
    readonly dateExpiration: string;
}