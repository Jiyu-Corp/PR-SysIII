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

  @Column("double precision", { name: "price", nullable: true })
  price: number | null;

  @Column("double precision", {
    name: "discount_additional",
    nullable: true,
    default: () => "0",
  })
  discountAdditional: number | null;

  @Column("double precision", {
    name: "total_price",
    nullable: true
  })
  totalPrice: number | null;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @Column("date", { name: "date_checkout", nullable: true })
  dateCheckout: string;

  // Soft delete
  @ManyToOne(() => Agreement, (agreement) => agreement.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn([{ name: "id_agreement", referencedColumnName: "idAgreement" }])
  agreement: Agreement;

  // Soft delete
  @ManyToOne(() => Client, (client) => client.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: true,
    cascade: ['insert', 'update']
  })
  @JoinColumn([{ name: "id_client_entry", referencedColumnName: "idClient" }])
  clientEntry: Client;

  @ManyToOne(() => Park, (park) => park.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
  })
  @JoinColumn([{ name: "id_park", referencedColumnName: "idPark" }])
  park: Park;

  // Soft delete
  @ManyToOne(() => PriceTable, (priceTable) => priceTable.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn([
    { name: "id_price_table", referencedColumnName: "idPriceTable" },
  ])
  priceTable: PriceTable;

  // Soft delete
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.parkingServices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    cascade: ['insert','update']
  })
  @JoinColumn([{ name: "id_vehicle", referencedColumnName: "idVehicle" }])
  vehicle: Vehicle;
}