import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class BrandNotExists extends ExpectedError { constructor(){super("Marca não encontrado.")} }