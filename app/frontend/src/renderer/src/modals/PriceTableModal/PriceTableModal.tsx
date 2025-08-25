import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { CarIcon, CurrencyDollarIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./PriceTableModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { priceTableType } from "@renderer/types/resources/priceTableType";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import SelectCreateModal from "../SelectCreateModal/SelectCreateModal";
import { getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";

type PriceTableModalProps = { 
  priceTable: priceTableType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function PriceTableModal({priceTable, isOpen, closeModal}: PriceTableModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);
  const isEdicaoPriceTable = typeof priceTable !== 'undefined';

  // Inputs
  const idPriceTable = priceTable?.idPriceTable;
  const [pricePerHour, setPricePerHour] = useState<string>(priceTable?.pricePerHour || '');
  const [toleranceMinutes, setToleranceMinutes] = useState<string>(priceTable?.toleranceMinutes || '');
  const [idVehicleType, setIdVehicleType] = useState<number | null>(priceTable?.idVehicleType || null);
  const [priceTableHours, setPriceTableHours] = useState<{
    idPriceTableHour: number;
    hour: string;
    price: string;
  }[] | undefined>(priceTable?.priceTableHours);

  // Options
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchVehicleTypes()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);

  async function fetchVehicleTypes() {
    try {
      const vehicleTypes = await requestPRSYS('vehicle-type', '', 'GET');
      
      setVehicleTypes(vehicleTypes.map(c => ({
        id: c.idVehicleType,
        label: c.description 
      } as SelectOption))); 
    } catch(err) {
      toast.error('Erro ao consultar tipos de veiculos', errorToastStyle);
    }
  }
  
  // Behaviour
  const title = isEdicaoPriceTable
  ? "Editar Tabela de Preço"
  : "Cadastrar Tabela de Preço";

  const formatPricePerHour = (newValue: string) => {
    let formattedValue = newValue
      .replace(/[^0-9.,]/g, "")
      .replace(/(?<!\d)[.,]/g, "")
      .replace(/([.,]).*[.,]/g, "$1");
    
    const isCommaSeparator = formattedValue.indexOf(",") !== -1;
    const positionOfSeparator = isCommaSeparator
      ? formattedValue.indexOf(",")
      : formattedValue.indexOf(".");
    if(positionOfSeparator !== -1)
      formattedValue = formattedValue.slice(0, (positionOfSeparator + 3));

    const numericValue = parseFloat(formattedValue.replace(/,/g, "."));
    
    setPricePerHour(formattedValue == "" || numericValue<=1000
      ? formattedValue
      : positionOfSeparator !== -1
        ? formattedValue.slice(0, positionOfSeparator-1) + formattedValue.slice(positionOfSeparator)
        : formattedValue.slice(0, -1)
    );
  }
  const formatToleranceTime = (newValue: string) => {
    const formattedValue = Number(newValue.replace(/\D/g, ""));
    setToleranceMinutes(formattedValue<=60 
      ? formattedValue.toString() 
      : "60"
    );
  }
  
  // Actions
  async function savePriceTable() {
    // const params = {
    //   plate: plate,
    //   model: {
    //     idModel: model && model.id !== -1 
    //       ? Number(model.id)
    //       : undefined,
    //     nameModel: model?.label,
    //     idPriceTableType: idPriceTableType && Number(idPriceTableType) || undefined,
    //     idBrand: brand && brand.id !== -1
    //       ? Number(brand.id)
    //       : undefined,
    //     brand: {
    //       nameBrand: brand?.label
    //     }
    //   },
    //   year: year && Number(year) || undefined,
    //   color: color || undefined,
    //   idClient: idClient && Number(idClient) || undefined
    // }
    // try {
    //   await requestPRSYS('priceTable', '', 'POST', params);

    //   closeModal();

    //   toast.success('Veiculo criado.', successToastStyle);
    // } catch(err) {
    //   toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    // }
  }
  
  async function editPriceTable() {
  }

  async function deletePriceTable() {
  }

  return <Modal1 isLoading={isLoading} maxWidth="450px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={CurrencyDollarIcon}>
    <div className="priceTable-modal">
      <div className="inputs-wrapper">
        <SelectModal width="180px" label="Tipo do Veiculo" options={vehicleTypes} value={idVehicleType} setValue={setIdVehicleType} />
        <InputModal width="120px" label="Preço" value={pricePerHour} setValue={setPricePerHour} onChange={formatPricePerHour}/>
        <InputModal width="170px" label="Tolerancia(min)" value={toleranceMinutes} setValue={setToleranceMinutes} onChange={formatToleranceTime} />
      </div>
      <div className="btns-wrapper">
        {isEdicaoPriceTable
          ? <>
            <EditBtnModal action={editPriceTable}/>
            <DeleteBtnModal action={deletePriceTable}/>
          </>
          : <>
            <SaveBtnModal action={savePriceTable}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}