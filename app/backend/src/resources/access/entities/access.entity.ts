import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("access_pkey", ["idAccess"], { unique: true })
@Entity("access", { schema: "public" })
export class Access {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_access" })
    idAccess: number;

    @Column("character varying", { name: "username", length: 50 })
    username: string;

    @Column("character varying", { name: "password", length: 255 })
    password: string;

    @Column("character varying", { name: "email", length: 255 })
    email: string;

    @Column("boolean", { name: "is_active", default: () => "true" })
    isActive: boolean;

    @Column("date", { name: "date_register", default: () => "CURRENT_DATE" })
    dateRegister: string;

    @Column("date", { name: "date_update", default: () => "CURRENT_DATE" })
    dateUpdate: string;
}