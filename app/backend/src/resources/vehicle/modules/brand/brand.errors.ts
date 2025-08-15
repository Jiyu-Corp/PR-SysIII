import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class ExistParkedVehicleWithinThatBrand extends ExpectedError { constructor(){super("Existem veículos desta marca estacionados!")} }
export class BrandNotExists extends ExpectedError { constructor(){super("Marca não encontrado.")} }