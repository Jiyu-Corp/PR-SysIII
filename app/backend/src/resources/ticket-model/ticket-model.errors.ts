import { ExpectedError, RedundancyInUniqueError } from "src/utils/app.errors";

export class TicketModelNotExists extends ExpectedError { constructor(){super("Modelo de Ticket não encontrado.")} }
export class ActiveTicketModelAlreadyExists extends ExpectedError { constructor(){super("Ja existe um modelo de ticket ativo.")} }
export class TicketModelNameExists extends RedundancyInUniqueError { constructor(){super("UK_TicketModel_name", "Este nome ja esta sendo usado por outro modelo.")} }