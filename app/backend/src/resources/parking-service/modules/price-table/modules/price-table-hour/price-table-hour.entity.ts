import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PriceTable } from "../../price-table.entity";

@Index("price_table_hour_pkey", ["idPriceTableHour"], { unique: true })
@Entity("price_table_hour", { schema: "public" })
export class PriceTableHour {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_price_table_hour" })
  idPriceTableHour: number;

  @Column("integer", { name: "hour" })
  hour: number;

  @Column("double precision", { name: "price" })
  price: number;

  @ManyToOne(() => PriceTable, (priceTable) => priceTable.priceTableHours, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: ["insert", "update"]
  })
  @JoinColumn([
    { name: "id_price_table", referencedColumnName: "idPriceTable" },
  ])
  priceTable: PriceTable;
}