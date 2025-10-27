import { ArticleIcon, IconProps } from "@phosphor-icons/react";
import Modal1 from "../Modal1/Modal1";

import "./TicketModal.css";
import { ticketModelType } from "@renderer/types/resources/ticketModelType";
import { reportType } from "@renderer/types/resources/reportType";
import { numeroParaMoeda } from "@renderer/utils/utils";

type TicketModalProps = {
  ticketModel: ticketModelType,
  ticketDataModal: reportType,
  isOpen: boolean;
  closeModal: () => void; 
}

export default function TicketModal({
  ticketModel,
  ticketDataModal,
  isOpen,
  closeModal
}: TicketModalProps) {
  console.log(ticketDataModal);
  return <Modal1 className="ticket-modal" title={"Ticket"} isOpen={isOpen} closeModal={closeModal} entityIcon={ArticleIcon} minWidth={"500px"} maxWidth={"800px"}>
    <div className="ticket-wrapper">
      <p className="ticket-header">{ticketModel.header}</p>
      <p className="ticket-content">{
       `Placa: ${ticketDataModal.plate}
        ${ticketDataModal.clientName ? `Cliente: ${ticketDataModal.clientName}` : ""}
        Entrada: ${ticketDataModal.dateParkingServiceStart}
        Saida: ${ticketDataModal.dateParkingServiceEnd}
        Preço: R$ ${ticketDataModal.price ? ticketDataModal.price : "0.00"}
      `}</p>
      <p className="ticket-footer">{ticketModel.footer}</p>
    </div>
  </Modal1>
}