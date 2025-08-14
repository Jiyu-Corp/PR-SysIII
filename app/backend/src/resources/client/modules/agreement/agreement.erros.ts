import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class AgremeentNotExists extends ExpectedError { constructor(){super("Convenio não encontrado.")} }
export class AgremeentClientExists extends RedundancyInUniqueError { constructor(){super("UK_Agreement_idClient", "Este cliente ja esta vinculado a outro convenio")} }