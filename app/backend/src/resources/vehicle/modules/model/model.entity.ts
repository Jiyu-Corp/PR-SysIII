import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Brand } from "../brand/brand.entity";
import { VehicleType } from "../vehicle-type/vehicle-type.entity";
import { Vehicle } from "../../vehicle.entity";

@Index("model_pkey", ["idModel"], { unique: true })
@Entity("model", { schema: "public" })
export class Model {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_model" })
  idModel: number;

  @Column("character varying", { name: "name", length: 50 })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.models, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_brand", referencedColumnName: "idBrand" }])
  brand: Brand;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.models, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "id_vehicle_type", referencedColumnName: "idVehicleType" },
  ])
  vehicleType: VehicleType;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles: Vehicle[];
}