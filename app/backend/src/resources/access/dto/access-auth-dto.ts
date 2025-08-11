import { Access } from "../entities/access.entity";

export class AccessAuthDto {
    readonly access: Access;
    readonly authToken: string;
}