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
import { TicketModel } from "../ticket-model/ticket-model.entity";

// Limitar estacionar mesmo carro
@Index("parking_service_pkey", ["idParkingService"], { unique: true })

@Index('UK_ParkingService_vehicle', ['vehicle'], { unique: true, where: '"is_parking" = TRUE' })

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

  @Column({ type: "timestamp", name: "date_register", default: () => "CURRENT_TIMESTAMP" })
  dateRegister: Date;

  @Column({ type: "timestamp", name: "date_update", default: () => "CURRENT_TIMESTAMP" })
  dateUpdate: Date;

  @Column({ type: "timestamp", name: "date_checkout", nullable: true })
  dateCheckout: Date;

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

  // Soft delete
  @ManyToOne(() => TicketModel, (ticketModel) => ticketModel.parkingServices, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
    cascade: ['insert','update']
  })
  @JoinColumn([{ name: "id_ticket_model", referencedColumnName: "idTicketModel" }])
  ticketModel: TicketModel;
}