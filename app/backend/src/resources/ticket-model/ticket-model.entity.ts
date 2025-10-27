import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ParkingService } from "../parking-service/parking-service.entity";

@Index("ticket_model_pkey", ["idTicketModel"], { unique: true })

@Index('UK_TicketModel_name', ['name'], { unique: true })

@Entity("ticket_model", { schema: "public" })
export class TicketModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_ticket_model" })
  idTicketModel: number;

  @Column("character varying", { name: "name", length: 50 })
  name: string;

  @Column("character varying", { name: "header", nullable: true, length: 255 })
  header: string | null;

  @Column("character varying", { name: "footer", nullable: true, length: 255 })
  footer: string | null;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @OneToMany(() => ParkingService, (parkingService) => parkingService.vehicle)
  parkingServices: ParkingService[];
}