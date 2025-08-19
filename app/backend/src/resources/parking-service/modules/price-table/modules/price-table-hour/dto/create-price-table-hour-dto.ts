import { IsDefined, IsNumber, Min } from "class-validator";

export class CreatePriceTableHourDto {
    @IsDefined()
    @IsNumber()
    @Min(0)
    readonly hour: number;

    @IsDefined()
    @IsNumber()
    @Min(0)
    readonly price: number;
}