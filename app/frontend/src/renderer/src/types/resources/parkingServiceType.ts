import { clientType } from "./clientType";
import { vehicleType } from "./vehicleType";

export type parkingServiceType = {
  idParkingService: number;
  vehicle: vehicleType 
  client?: clientType;
  dateRegister?: string;
  brandModelYear?: string;
}