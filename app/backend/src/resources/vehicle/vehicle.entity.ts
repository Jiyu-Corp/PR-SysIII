import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { ParkingService } from "../parking-service/parking-service.entity";
import { Client } from "../client/client.entity";
import { Model } from "./modules/model/model.entity";

@Index("vehicle_pkey", ["idVehicle"], { unique: true })

@Index('UK_Vehicle_plate', ['plate'], { unique: true, where: '"isActive" = TRUE' })

@Entity("vehicle", { schema: "public" })
export class Vehicle {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_vehicle" })
  idVehicle: number;

  @Column("character varying", { name: "plate", length: 20 })
  plate: string;

  @Column("character varying", { name: "color", nullable: true, length: 50 })
  color: string | null;

  @Column("integer", { name: "year", nullable: true })
  year: number | null;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @OneToMany(() => ParkingService, (parkingService) => parkingService.vehicle)
  parkingServices: ParkingService[];

  // Soft delete
  @ManyToOne(() => Client, (client) => client.vehicles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn([{ name: "id_client", referencedColumnName: "idClient" }])
  client: Client;

  @ManyToOne(() => Model, (model) => model.vehicles, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn([{ name: "id_model", referencedColumnName: "idModel" }])
  model: Model;
}