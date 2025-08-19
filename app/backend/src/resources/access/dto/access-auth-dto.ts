import { IsDefined, IsObject, IsString } from "class-validator";
import { Access } from "../access.entity";

export class AccessAuthDto {
    @IsDefined()
    @IsObject()
    readonly access: Access;

    @IsDefined()
    @IsString()
    readonly authToken: string;
}