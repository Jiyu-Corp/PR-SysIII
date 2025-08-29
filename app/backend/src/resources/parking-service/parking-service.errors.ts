import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class VehicleAlreadyParked extends RedundancyInUniqueError { constructor(){super("UK_ParkingService_vehicle", "O veiculo ja esta estacionado.")} }
export class ParkingServiceNotExists extends ExpectedError { constructor(){super("Serviço de estacionamento não encontrado.")} }
export class VehicleWithoutModel extends ExpectedError { constructor(){super("O veículo precisa ter um modelo vinculado.")} }