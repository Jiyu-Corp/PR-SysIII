import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class ModelNotExists extends ExpectedError { constructor(){super("Modelo não encontrado.")} }