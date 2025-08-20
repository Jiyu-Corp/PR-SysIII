import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ParkingService } from "../../parking-service.entity";
import { VehicleType } from "src/resources/vehicle/modules/vehicle-type/vehicle-type.entity";
import { PriceTableHour } from "./modules/price-table-hour/price-table-hour.entity";

@Index("price_table_pkey", ["idPriceTable"], { unique: true })

@Index('UK_PriceTable_idVehicleType', ['vehicleType'], { unique: true, where: '"is_active" = TRUE' })

@Entity("price_table", { schema: "public" })
export class PriceTable {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_price_table" })
  idPriceTable: number;

  @Column("double precision", { name: "price_per_hour" })
  pricePerHour: number;

  @Column("integer", { name: "tolerance_minutes", nullable: true })
  toleranceMinutes: number | null;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
  dateRegister: string;

  @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
  dateUpdate: string;

  @OneToMany(
    () => ParkingService,
    (parkingService) => parkingService.priceTable
  )
  parkingServices: ParkingService[];

  // Soft delete
  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.priceTables, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "id_vehicle_type", referencedColumnName: "idVehicleType" },
  ])
  vehicleType: VehicleType;

  @OneToMany(
    () => PriceTableHour,
    (priceTableHour) => priceTableHour.priceTable,
    { cascade: ['insert', 'update'] }
  )
  priceTableHours: PriceTableHour[];
}