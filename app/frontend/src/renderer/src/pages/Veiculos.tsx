import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
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

export default function VeiculosPage() {
  const navigate = useNavigate();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
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
            idVehicleType: item.model?.idVehicleType,
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
      label: "Tipo do veiculo",
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
      icon: <MagnifyingGlassIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: vehicleType) => {
        handleEdit(row);
      },
    },
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

  const handleEdit = async (row: any) => {
    /*setVehicleDetail({
      idClient: Number(row.id),
      name: row.name,
      cpfCnpj: row.cpf_cnpj,
      email: row.email,
      phone: row.phone,
      enterprise: row.idClientEnterprise
        ? {
            idClient: Number(row.idClientEnterprise),
            name: row.enterprise ?? row.enterprise ?? "" 
          }
        : undefined
    });*/
    setIsVehicleModalOpen(true);
  };

  useEffect(() => {
    if(!isVehicleModalOpen) {
      setVehicleDetail(undefined);
      fetchVeiculos();
    }
  }, [isVehicleModalOpen])

  
  const rowsToShow = filtered ?? rows;

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Veiculos" actionLabel="Cadastrar Veiculo" onAction={handleCreate} onAction2={handleEdit} actionIcon={<UserIcon size={20} />} />
      <GenericFilters fields={filters} onSearch={handleSearch} />
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
            title="Listagem de Clientes"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rowsToShow.length}
            //onGenerateCSV={handleGenerateCSV}
          />
    }
    </main>
    {isVehicleModalOpen && <VehicleModal isOpen={isVehicleModalOpen} closeModal={() => setIsVehicleModalOpen(false)} vehicle={vehicleDetail}/>}
  </>);
}
