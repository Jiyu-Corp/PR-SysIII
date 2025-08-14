import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class VehicleTypeNotExists extends ExpectedError { constructor(){super("Tipo de veiculo não encontrado.")} }
export class ExistParkedVehicleWithinModelUsingThatVehicleType extends ExpectedError { constructor(){super("Existem veículos que utilizam este tipo de veiculo estacionados!")} }
export class VehicleTypeDescriptionExists extends RedundancyInUniqueError { constructor(){super("UK_VehicleType_description", "Este nome ja foi dado a outro tipo de veiculo")} }