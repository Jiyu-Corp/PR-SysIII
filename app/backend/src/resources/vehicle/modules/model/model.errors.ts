import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class ExistParkedVehicleWithinThatModel extends ExpectedError { constructor(){super("Existem veículos deste modelo estacionados!")} }
export class ModelNotExists extends ExpectedError { constructor(){super("Modelo não encontrado.")} }