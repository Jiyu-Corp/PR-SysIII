import { ExpectedError } from "src/utils/app.errors";

export class DefaultParkNotExists extends ExpectedError { constructor(){super("Estacionamento padrão não cadastrado.")} }