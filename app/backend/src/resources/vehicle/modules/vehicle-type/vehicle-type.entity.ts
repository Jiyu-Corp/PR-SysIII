import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Model } from "../model/model.entity";
import { PriceTable } from "src/resources/parking-service/modules/price-table/price-table.entity";

@Index("vehicle_type_pkey", ["idVehicleType"], { unique: true })
@Entity("vehicle_type", { schema: "public" })
export class VehicleType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_vehicle_type" })
  idVehicleType: number;

  @Column("character varying", { name: "description", length: 50 })
  description: string;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @OneToMany(() => Model, (model) => model.idVehicleType)
  models: Model[];

  @OneToMany(() => PriceTable, (priceTable) => priceTable.idVehicleType)
  priceTables: PriceTable[];
}