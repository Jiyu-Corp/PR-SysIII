import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "../../client.entity";

@Index("client_type_pkey", ["idClientType"], { unique: true })
@Entity("client_type", { schema: "public" })
export class ClientType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_client_type" })
  idClientType: number;

  @Column("character varying", { name: "description", length: 50 })
  description: string;

  @OneToMany(() => Client, (client) => client.idClientType)
  clients: Client[];
}