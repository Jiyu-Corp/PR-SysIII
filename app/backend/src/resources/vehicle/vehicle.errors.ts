import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class VehicleIsParked extends ExpectedError { constructor(){super("O veiculo esta estacionado.")} }
export class VehiclePlateExists extends RedundancyInUniqueError { constructor(){super("UK_Vehicle_plate", "Esta placa ja esta cadastrada.")} }
export class VehicleNotExists extends ExpectedError { constructor(){super("Veículo não encontrado.")} }