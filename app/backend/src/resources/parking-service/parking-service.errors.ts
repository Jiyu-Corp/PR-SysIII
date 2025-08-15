import { ExpectedError } from "src/utils/app.errors";

export class ParkingServiceNotExists extends ExpectedError { constructor(){super("Serviço de estacionamento não encontrado.")} }
export class VehicleWithoutModel extends ExpectedError { constructor(){super("O veículo precisa ter um modelo vinculado.")} }