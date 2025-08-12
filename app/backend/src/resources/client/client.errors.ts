import { ExpectedError } from "src/utils/app.errors";

export class ClientCpfCnpjExists extends ExpectedError { constructor(){super("Este cpf/cnpj ja existe.")} }
export class ClientNotExists extends ExpectedError { constructor(){super("Cliente não encontrado.")} }