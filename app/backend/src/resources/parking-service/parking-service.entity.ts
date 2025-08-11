import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Agreement } from "../client/modules/agreement/agreement.entity";
import { Client } from "../client/client.entity";
import { Park } from "./modules/park/park.entity";
import { PriceTable } from "./modules/price-table/price-table.entity";
import { Vehicle } from "../vehicle/vehicle.entity";

@Index("parking_service_pkey", ["idParkingService"], { unique: true })
@Entity("parking_service", { schema: "public" })
export class ParkingService {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_parking_service" })
  idParkingService: number;

  @Column("boolean", { name: "is_parking", default: () => "true" })
  isParking: boolean;

  @Column("double precision", { name: "price", nullable: true, precision: 53 })
  price: number | null;

  @Column("double precision", {
    name: "discount_additional",
    nullable: true,
    precision: 53,
    default: () => "0",
  })
  discountAdditional: number | null;

  @Column("double precision", {
    name: "total_price",
    nullable: true,
    precision: 53,
  })
  totalPrice: number | null;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @ManyToOne(() => Agreement, (agreement) => agreement.parkingServices, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_agreement", referencedColumnName: "idAgreement" }])
  idAgreement: Agreement;

  @ManyToOne(() => Client, (client) => client.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_client_entry", referencedColumnName: "idClient" }])
  idClientEntry: Client;

  @ManyToOne(() => Park, (park) => park.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_park", referencedColumnName: "idPark" }])
  idPark: Park;

  @ManyToOne(() => PriceTable, (priceTable) => priceTable.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "id_price_table", referencedColumnName: "idPriceTable" },
  ])
  idPriceTable: PriceTable;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_vehicle", referencedColumnName: "idVehicle" }])
  idVehicle: Vehicle;
}