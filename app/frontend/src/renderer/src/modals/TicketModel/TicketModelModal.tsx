import { useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { HandshakeIcon} from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./TicketModelModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { ticketModelType } from "@renderer/types/resources/ticketModelType";
import { requestPRSYS } from "@renderer/utils/http";
import { PrsysError } from "@renderer/types/prsysErrorType";
import { getErrorMessage } from "@renderer/utils/utils";
import Swal from 'sweetalert2';

type TicketModelModalProps = { 
  ticketModel: ticketModelType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function TicketModelModal({ticketModel, isOpen, closeModal}: TicketModelModalProps) {
  // Control Params
  const isEdicaoTicketModel = typeof ticketModel !== 'undefined';

  // Inputs
  const idTicketModel = ticketModel?.idTicketModel;
  const [name, setName] = useState<string>(ticketModel?.name || '');
  const [header, setHeader] = useState<string>(ticketModel?.header || '');
  const [footer, setFooter] = useState<string>(ticketModel?.footer || '');

  // Behaviour
  const title = isEdicaoTicketModel
    ? "Editar modelo de ticket"
    : "Cadastrar modelo de ticket";

  // Actions
  async function saveTicketModel() {
    const params = {
      name: name,
      header: header,
      footer: footer
    }
    try {
      await requestPRSYS('ticket-model', '', 'POST', params);

      closeModal();

      toast.success('Modelo criado.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  async function editTicketModel() {
  }

  async function deleteTicketModel() {
  }

  return <Modal1 maxWidth="650px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={HandshakeIcon}>
    <div className="ticket-model-modal">
      <div className="inputs-wrapper">
        <InputModal width="200px" label="Modelo" value={name} setValue={setName}/>
        <InputModal width="400px" label="Cabeçalho" value={header} setValue={setHeader} textAreaData={{rows: 5}}/>
        <InputModal width="400px" label="Rodape" value={footer} setValue={setFooter} textAreaData={{rows: 5}}/>
      </div>
      <div className="btns-wrapper">
        {isEdicaoTicketModel
          ? <>
            <EditBtnModal action={editTicketModel}/>
            <DeleteBtnModal action={deleteTicketModel}/>
          </>
          : <>
            <SaveBtnModal action={saveTicketModel}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}