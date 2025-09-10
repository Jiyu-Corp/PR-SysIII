import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon, PencilIcon, TrashIcon, CarIcon } from "@phosphor-icons/react";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { Toaster, toast } from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import VehicleModal from "@renderer/modals/VehicleModal/VehicleModal";
import { vehicleType } from "@renderer/types/resources/vehicleType";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import Swal from 'sweetalert2';
import BrandModelDeleteModal from "@renderer/modals/BrandModelDeleteModal/BrandModelDeleteModel";
import { PrsysError } from "@renderer/types/prsysErrorType";
import { getErrorMessage } from "@renderer/utils/utils";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";

export default function VeiculosPage() {
  const navigate = useNavigate();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
  const [isBrandModelDeleteModalOpen, setIsBrandModelDeleteModalOpen] = useState<boolean>(false);
  const [vehicleDetail, setVehicleDetail] = useState<vehicleType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<vehicleType[]>([]);
  const [filtered, setFiltered] = useState<vehicleType[] | null>(null);
  
  const [brands, setBrands] = useState<(SelectOption & {
    models?: ({ idVehicleType: number } & SelectOption)[];
  })[]>([]);
  const [models, setModels] = useState<SelectOptionGroup[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
  const [clients, setClients] = useState<SelectOption[]>([]);

  useEffect(() => {
    setLoading(true);

    const fetches: Promise<void>[] = [
      fetchVeiculos(),
      fetchBrandsAndModels(),
      fetchVehicleTypes(),
      fetchClients()
    ];

    Promise.all(fetches).then(() => setLoading(false));
  }, []);

  const fetchVeiculos = async () => {
      setLoading(true);
      try {
        const response = await requestPRSYS('vehicle', '', 'GET');
        
        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        const mapped: vehicleType[] = (arr as any[]).map((item: any) => {

        return {
            idVehicle: item.idVehicle,
            plate: item.plate,
            model: item.model,
            idBrand: item.model?.brand?.idBrand,
            brandName: item.model?.brand?.name,
            idModel: item.model?.idModel,
            modelName: item.model?.name,
            idVehicleType: item.model?.vehicleType?.idVehicleType,
            vehicleType: item.model?.vehicleType?.description ?? '---',
            year: item.year ?? '---',
            color: item.color ?? '---',
            idClient: item.client ? item.client.idClient : '',
            clientName: item.client ? item.client.name : '---'
          };
        });        
        
        if (mapped.length) {
          setRows(mapped);
          setFiltered(null);
        } else {
          console.warn("fetchVeiculo: response:", response);
        }
        
      } catch (err) {
        console.error("fetchVeiculo error:", err);
      } finally {
        setLoading(false);
      }
  };

  async function fetchBrandsAndModels() {
    try {
      const brands = await requestPRSYS('brand', 'getActiveBrands', 'GET');

      const brandsOptions = brands.map(b => ({
        id: b.idBrand,
        label: b.name,
        models: b.models.map(m => ({
          id: m.idModel,
          label: m.name,
          idVehicleType: m.vehicleType.idVehicleType
        } as { idVehicleType: number } & SelectOption))
      } as SelectOption & {
        models: SelectOption[];
      }));

      setBrands(brandsOptions);

      populateModelOptionsWithSelectedBrand(brandsOptions);
    } catch(err) {
      toast.error('Erro ao consultar marcas', errorToastStyle);
    }
  }

  function populateModelOptionsWithSelectedBrand(brandsOptions?: (SelectOption & {
    models?: SelectOption[];
  })[]) {
    if(typeof brandsOptions === 'undefined')
      brandsOptions = brands;
    
    const modelOptions = brandsOptions.map(b => ({
          label: b.label,
          options: b.models || []
        } as SelectOptionGroup))

    setModels(modelOptions);
  }

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
  async function fetchClients() {
    try {
      const clients = await requestPRSYS('client', '', 'GET');
      
      setClients(clients.map(c => ({
        id: c.idClient,
        label: c.name 
      } as SelectOption))); 
    } catch(err) {
      toast.error('Erro ao consultar clientes', errorToastStyle);
    }
  }
  
  const filters: FilterField[] = [  
    { key: "plate", label: "Placa", 
      mask: () => '_______',
      replacement: { _: /[A-Z0-9]/},
      onChange: (value, setter) => setter(value.toUpperCase()),
      type: "text"
    },
    {
      key: "brands",
      label: "Marca",
      type: "select",
      options: brands,
    },
    {
      key: "models",
      label: "Modelo",
      type: "select",
      options: models,
    },
    {
      key: "vehicleTypes",
      label: "Tipo do veículo",
      type: "select",
      options: vehicleTypes
    },
    {
      key: "clients",
      label: "Nome cliente",
      type: "select",
      options: clients
    }
  ];

  const columns: TableColumn<vehicleType>[] = [
    { key: "plate", label: "Placa" },
    { key: "brandName", label: "Marca" },
    { key: "modelName", label: "Modelo" },
    { key: "year", label: "Ano" },
    { key: "vehicleType", label: "Tipo do Veículo" },
    { key: "color", label: "Cor" },
    { key: "clientName", label: "Cliente" }
  ];

  const actions = [
    {
      key: "view",
      label: "Visualizar",
      icon: <PencilIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: vehicleType) => {
        handleEdit(row);
      },
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <TrashIcon size={14} />,
      className: 'icon-btn-delete',
      onClick: (row: vehicleType) => {
        handleDelete(String(row.idVehicle!));
      },
    }
  ];

  const handleSearch = async (values: Record<string, any>) => {
    
    const plateFilter = values.plate ? values.plate.trim() : '';
    const brandFilter = values.brands ? Number(values.brands) : null;
    const modelFilter = values.models ? Number(values.models) : null;
    const typeFilter = values.vehicleTypes ? Number(values.vehicleTypes) : null;
    const clientFilter = values.clients ? Number(values.clients) : null;
    
    if (!plateFilter && !modelFilter && !typeFilter && !brandFilter && !clientFilter) {
      setFiltered(null);
      return;
    }
  
    setLoading(true);
    try {
      
      const params = {
        plate: plateFilter.toUpperCase() || undefined,
        idBrand: brandFilter || undefined,
        idModel: modelFilter || undefined,
        idVehicleType: typeFilter || undefined,
        idClient: clientFilter || undefined
      }
      
      const response = await requestPRSYS('vehicle', '', 'GET', undefined, params);
      const arr = Array.isArray(response) ? response : response?.data ?? [];

      if(response.length < 1){
        toast.error('Nenhum dado para esses filtros', errorToastStyle);
      }
      
      const mapped: vehicleType[] = (arr as any[]).map((item: any) => ({
          idVehicle: item.idVehicle,
          plate: item.plate,
          model: item.model,
          brandName: item.model?.brand?.name,
          modelName: item.model?.name,
          vehicleType: item.model?.vehicleType?.description ?? '---',
          year: item.year ?? '---',
          color: item.color ?? '---',
          clientName: item.client ? item.client.name : '---'
      }));
  
      setFiltered(mapped);

    } catch (err) {

      console.error("handleSearch erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsVehicleModalOpen(true);
  };

  const handleDeleteBrandModel = () => {
    setIsBrandModelDeleteModalOpen(true);
  }

  const handleEdit = async (row: any) => {
    setVehicleDetail({
      idVehicle: row.idVehicle,
      plate: row.plate,
      model: {
        idModel: row.idModel,
        nameModel: row.modelName,
        idVehicleType: row.idVehicleType,
        idBrand: row.idBrand,
        brand: {
          nameBrand: row.brandName
        }
      },
      year: row.year,
      color: row.color,
      idClient: row.idClient
    });
    
    setIsVehicleModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir este veículo?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS("vehicle", `${id}`, "DELETE");
        toast.success("Veículo excluído com sucesso!", successToastStyle);
        fetchVeiculos();
      }
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
    }
  };

  useEffect(() => {
    if(!isVehicleModalOpen && !isBrandModelDeleteModalOpen) {
      setVehicleDetail(undefined);
      fetchBrandsAndModels();
      fetchVeiculos();
    }
  }, [isVehicleModalOpen, isBrandModelDeleteModalOpen])

  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r: any) => ({
      Placa: r.plate,
      Marca: r.brandName,
      Modelo: r.modelName,
      Ano: r.year,
      Tipo: r.vehicleType,
      Cor: r.color,
      Cliente: r.clientName
    }));

    const csv = [
      Object.keys(data[0]).join(";"),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v ?? "")}"`).join(";")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veiculos.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rowsToShow = filtered ?? rows;

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericFilters title="Veiculos" fields={filters} onSearch={handleSearch} buttons={[
        <ButtonModal key={0} text="Cadastrar Veículo" action={handleCreate} color="#FFFFFF" backgroundColor="#3BB373" icon={CarIcon}/>,
        <ButtonModal key={0} text="Excluir Marca/Modelo" action={handleDeleteBrandModel} color="#FFFFFF" backgroundColor="#C2292E" icon={CarIcon}/>,
      ]} />
      {loading ? 
          <div style={{ margin: "24px 64px" }}>
          <Grid
            visible={true}
            height="80"
            width="80"
            color="#4A87E8"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{justifyContent: "center"}}
            wrapperClass="grid-wrapper"
          />
        </div>
        : 
          <GenericTable
            title="Listagem de Veículos"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rowsToShow.length}
            onGenerateCSV={handleGenerateCSV}
          />
    }
    </main>
    {isVehicleModalOpen && <VehicleModal isOpen={isVehicleModalOpen} closeModal={() => setIsVehicleModalOpen(false)} vehicle={vehicleDetail}/>}
    {isBrandModelDeleteModalOpen && <BrandModelDeleteModal isOpen={isBrandModelDeleteModalOpen} closeModal={() => setIsBrandModelDeleteModalOpen(false)}/>}
  </>);
}
