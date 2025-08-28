export type vehicleType = {
  idVehicle?: number;
  plate: string;
  model: {
    idModel?: number;
    nameModel: string;
    idVehicleType: number;
    idBrand?: number;
    brand?: {
      idBrand?: number;
      nameBrand: string;
    }
  };
  year?: string;
  color?: string;
  idClient?: number;
}