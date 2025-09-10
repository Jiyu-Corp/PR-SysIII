import { useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { CarIcon, CarProfileIcon, JeepIcon, MotorcycleIcon, TruckIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./VehicleTypeModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { vehicleTypeType } from "@renderer/types/resources/vehicleTypeType";
import { getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";

type VehicleTypeModalProps = { 
  vehicleType: vehicleTypeType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function VehicleTypeModal({vehicleType, isOpen, closeModal}: VehicleTypeModalProps) {
  // Data
  const vehicleTypeImages = [
    { idImage: 1, icon: CarProfileIcon },
    { idImage: 2, icon: MotorcycleIcon },
    { idImage: 3, icon: JeepIcon },
    { idImage: 4, icon: TruckIcon },
  ]
  
  // Control Params
  const isEdicaoVehicleType = typeof vehicleType !== 'undefined';

  // Inputs
  const idVehicleType = vehicleType?.idVehicleType;
  const [description, setDescription] = useState<string>(vehicleType?.description || '');
  const [idImage, setIdImage] = useState<number | null>(vehicleType?.idImage || null);
  
  // Behaviour
  const title = isEdicaoVehicleType
    ? "Editar Tipo de Veículo"
    : "Cadastrar Tipo de Veículo";
  
  // Actions
  async function saveVehicleType() {
    const params = {
      description: description,
      idImage: idImage
    }
    try {
      await requestPRSYS('vehicle-type', '', 'POST', params);

      closeModal();

      toast.success('Tipo de Veículo criado.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }
  
  async function editVehicleType() {
  }

  async function deleteVehicleType() {
  }

  return <Modal1 maxWidth="550px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={CarIcon}>
    <div className="vehicle-type-modal">
      <div className="inputs-wrapper">
        <InputModal width="160px" label="Tipo de Veículo" value={description} setValue={setDescription} required/>
        <div style={{display: "flex", flexDirection: "column", gap: 5}}>
          <label htmlFor="input-idimage" style={{fontSize: 14}}>Imagem Representativa</label>
          <div className="input-image-wrapper">
            {vehicleTypeImages.map(({ idImage: id, icon: Icon }) =>
              <Icon key={id} size={28} onClick={() => setIdImage(id)} color={`${id === idImage ? "#4A87E8" : "#000000a1"}`} cursor={"pointer"}/>
            )}
          </div>
        </div>
      </div>
      <div className="btns-wrapper">
        {isEdicaoVehicleType
          ? <>
            <EditBtnModal action={editVehicleType}/>
            <DeleteBtnModal action={deleteVehicleType}/>
          </>
          : <>
            <SaveBtnModal action={saveVehicleType}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}