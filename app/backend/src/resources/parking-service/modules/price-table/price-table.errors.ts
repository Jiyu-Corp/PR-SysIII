import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class PriceTableNotExists extends ExpectedError { constructor(){super("Tabela de preço não encontrado.")} }
export class PriceTableVehicleTypeExists extends RedundancyInUniqueError { constructor(){super("UK_PriceTable_idVehicleType", "Este tipo de veiculo ja possui uma tabela de preços.")} }
export class ExistParkedVehicleWithinModelUsingThatPriceTable extends ExpectedError { constructor(){super("Existem veículos que utilizam esta tabela de preço estacionados!")} }