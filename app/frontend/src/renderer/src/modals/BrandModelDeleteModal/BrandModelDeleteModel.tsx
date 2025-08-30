import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { CarIcon, TrashIcon } from "@phosphor-icons/react";

import "./BrandModelDeleteModel.css"
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import { getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";
import useEffectSkipFirstRender from "@renderer/hooks/effectSkipFirstRender";
import Swal from 'sweetalert2';
import ButtonModal from "../ButtonModal/ButtonModal";

type BrandModelDeleteModalProps = {
  isOpen: boolean;
  closeModal: () => void; 
};

export default function BrandModelDeleteModal({isOpen, closeModal}: BrandModelDeleteModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);

  // Inputs
  const [idBrand, setIdBrand] = useState<number | null>(null);
  const [idModel, setIdModel] = useState<number | null>(null);

  // Options
  const [brands, setBrands] = useState<(SelectOption & {
    models?: SelectOption[];
  })[]>([]);
  const [models, setModels] = useState<SelectOptionGroup[]>([]);
  
  // Options Fetch
  useEffect(() => {
    fetchOptions();
  }, []);
  function fetchOptions() {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchBrandsAndModels()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }

  async function fetchBrandsAndModels() {
    try {
      const brands = await requestPRSYS('brand', 'getActiveBrands', 'GET');

      const brandsOptions = brands.map(b => ({
        id: b.idBrand,
        label: b.name,
        models: b.models.map(m => ({
          id: m.idModel,
          label: m.name
        } as SelectOption))
      } as SelectOption & {
        models: SelectOption[];
      }));

      setBrands(brandsOptions);

      populateModelOptionsWithSelectedBrand(brandsOptions);

    } catch(err) {
      toast.error('Erro ao consultar marcas', errorToastStyle);
    }
  }
  
  // Behaviour
  useEffectSkipFirstRender(() => {
    populateModelOptionsWithSelectedBrand();
    setIdModel(null);
  }, [idBrand])

  function populateModelOptionsWithSelectedBrand(brandsOptions?: (SelectOption & {
    models?: SelectOption[];
  })[]) {
    if(typeof brandsOptions === 'undefined')
      brandsOptions = brands;

    const selectedBrand = brandsOptions.find(b => b.id == idBrand);

    const modelOptions = typeof selectedBrand !== 'undefined'
      ? [{
        label: selectedBrand.label,
        options: selectedBrand.models || []
      } as SelectOptionGroup]
      : idBrand === null
        ? brandsOptions.map(b => ({
          label: b.label,
          options: b.models || []
        } as SelectOptionGroup))
        : [];

    setModels(modelOptions);
  }

  // Actions
  async function deleteBrand() {
    if(idBrand === null) return;

    try {
      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir esta marca? Isto irá deletar tambem seus modelos relacionados.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS('brand', idBrand.toString(), 'DELETE');
        
        fetchOptions();
        setIdBrand(null);
        setIdModel(null);
        
        toast.success('Marca deletada junto com suas marcas.', successToastStyle);
      }
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  async function deleteModel() {
    if(idModel === null) return;

    try {
      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir esta marca?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS('model', idModel.toString(), 'DELETE');
        
        fetchOptions();
        setIdBrand(null);
        setIdModel(null);
        
        toast.success('Modelo deletado.', successToastStyle);
      }
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  return <Modal1 isLoading={isLoading} maxWidth="450px" title={"Deletar Marca/Modelo"} isOpen={isOpen} closeModal={closeModal} entityIcon={CarIcon}>
    <div className="brand-model-modal">
      <div className="inputs-wrapper">
        <SelectModal width="180px" label="Marca" options={brands} value={idBrand} setValue={setIdBrand} />
        <SelectModal width="180px" label="Modelo" options={models} value={idModel} setValue={setIdModel} />
      </div>
      <div className="btns-wrapper">
        <ButtonModal icon={TrashIcon} text="Deletar Marca" color="#FFFFFF" backgroundColor="#C2292E" action={deleteBrand} isDisabled={idBrand == null}/>
        {idModel !== null &&
          <ButtonModal icon={TrashIcon} text="Deletar Modelo" color="#FFFFFF" backgroundColor="#C2292E" action={deleteModel}/>
        }
      </div>
    </div>
  </Modal1>
}