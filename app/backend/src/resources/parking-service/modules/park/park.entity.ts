import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ParkingService } from "../../parking-service.entity";

@Index("park_pkey", ["idPark"], { unique: true })
@Entity("park", { schema: "public" })
export class Park {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_park" })
  idPark: number;

  @Column("character varying", { name: "description", length: 100 })
  description: string;

  @OneToMany(() => ParkingService, (parkingService) => parkingService.park)
  parkingServices: ParkingService[];
}