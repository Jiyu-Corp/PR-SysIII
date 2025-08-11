import { Access } from "../access.entity";

export class AccessAuthDto {
    readonly access: Access;
    readonly authToken: string;
}