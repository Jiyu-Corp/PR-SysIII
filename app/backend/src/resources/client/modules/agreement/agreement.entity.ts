import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "../../client.entity";
import { ParkingService } from "src/resources/parking-service/parking-service.entity";

@Index("agreement_pkey", ["idAgreement"], { unique: true })
@Entity("agreement", { schema: "public" })
export class Agreement {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_agreement" })
  idAgreement: number;

  @Column("double precision", {
    name: "fix_discount",
    nullable: true,
    precision: 53,
  })
  fixDiscount: number | null;

  @Column("double precision", {
    name: "percentage_discount",
    nullable: true,
    precision: 53,
  })
  percentageDiscount: number | null;

  @Column("date", { name: "date_expiration" })
  dateExpiration: string;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @ManyToOne(() => Client, (client) => client.agreements, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_client", referencedColumnName: "idClient" }])
  idClient: Client;

  @OneToMany(
    () => ParkingService,
    (parkingService) => parkingService.idAgreement
  )
  parkingServices: ParkingService[];
}