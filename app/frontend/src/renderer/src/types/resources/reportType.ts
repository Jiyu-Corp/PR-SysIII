import { ticketModelType } from "./ticketModelType";

export type reportType = {
	clientName: string;
	brandModelYear: string;
	dateParkingServiceEnd: string;
	dateParkingServiceStart: string;
	plate: string;
	price: string;
  ticketModel: ticketModelType
}