export type priceTableType = {
  idPriceTable: number;
  pricePerHour: string;
  toleranceMinutes: string;
  idVehicleType: number;
  priceTableHours: {
    idPriceTableHour: number;
    hour: string;
    price: string;
  }[]
}