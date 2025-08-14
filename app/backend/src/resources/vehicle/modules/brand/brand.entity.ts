import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Model } from "../model/model.entity";

@Index("brand_pkey", ["idBrand"], { unique: true })
@Entity("brand", { schema: "public" })
export class Brand {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_brand" })
  idBrand: number;

  @Column("character varying", { name: "name", length: 50 })
  name: string;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @OneToMany(() => Model, (model) => model.brand)
  models: Model[];
}