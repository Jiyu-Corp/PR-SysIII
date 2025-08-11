import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Agreement } from "./modules/agreement/agreement.entity";
import { ClientType } from "./modules/client-type/client-type.entity";
import { ParkingService } from "../parking-service/parking-service.entity";
import { Vehicle } from "../vehicle/vehicle.entity";

@Index("client_pkey", ["idClient"], { unique: true })
@Entity("client", { schema: "public" })
export class Client {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_client" })
  idClient: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "cpf_cnpj", length: 20 })
  cpfCnpj: string;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 20 })
  phone: string | null;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @OneToMany(() => Agreement, (agreement) => agreement.idClient)
  agreements: Agreement[];

  @ManyToOne(() => Client, (client) => client.enterpriseClients, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "id_client_enterprise", referencedColumnName: "idClientEnterprise" },
  ])
  clientEnterprise: Client;

  @OneToMany(() => Client, (client) => client.clientEnterprise)
  enterpriseClients: Client[];

  @ManyToOne(() => ClientType, (clientType) => clientType.clients, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "id_client_type", referencedColumnName: "idClientType" },
  ])
  clientType: ClientType;

  @OneToMany(
    () => ParkingService,
    (parkingService) => parkingService.clientEntry
  )
  parkingServices: ParkingService[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.client)
  vehicles: Vehicle[];
}