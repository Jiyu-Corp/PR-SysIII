import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class ClientCpfCnpjExists extends RedundancyInUniqueError { constructor(){super("UK_Client_cpfCnpj", "Este cpf/cnpj ja esta cadastrada.")} }
export class ClientNotExists extends ExpectedError { constructor(){super("Cliente não encontrado.")} }