import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class VehicleIsParked extends ExpectedError { constructor(){super("O veiculo esta estacionado.")} }
export class VehiclePlateExists extends RedundancyInUniqueError { constructor(){super("UK_Vehicle_plate", "Esta placa ja esta cadastrada.")} }
export class VehicleNotExists extends ExpectedError { constructor(){super("Veículo não encontrado.")} }

export class ModelNameExists extends RedundancyInUniqueError { constructor(){super("UK_Model_name_brand", "O nome de modelo esta em uso para esta marca.")} }
export class BrandNameExists extends RedundancyInUniqueError { constructor(){super("UK_Brand_name", "Nome de marca em uso.")} }