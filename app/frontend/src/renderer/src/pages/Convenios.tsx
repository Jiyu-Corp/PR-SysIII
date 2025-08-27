import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { HandshakeIcon, PencilIcon, TrashIcon  } from "@phosphor-icons/react";
import { Toaster, toast } from "react-hot-toast";
import AgreementModal from "@renderer/modals/AgreementModal/AgreementModal";
import { agreementType } from "@renderer/types/resources/agreementType";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { numeroParaMoeda, formatPercentage } from "@renderer/utils/utils";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import Swal from 'sweetalert2';


export default function ConvenioPage() {
  const navigate = useNavigate();
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState<boolean>(false);
  const [agreementDetail, setAgreementDetail] = useState<agreementType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  const [rows, setRows] = useState<agreementType[]>([]);
  const [filtered, setFiltered] = useState<agreementType[] | null>(null);
  
  const [agreementEnterprises, setClientEnterprises] = useState<SelectOption[]>([]);

  useEffect(() => {
    setLoading(true);

    const fetches: Promise<void>[] = [
      fetchConvenios(),
      fetchClientEnterprises()
    ];

    Promise.all(fetches).then(() => setLoading(false));
  }, []);

  const fetchConvenios = async () => {
      setLoading(true);
      try {
        const response = await requestPRSYS('agreement', '', 'GET');
        
        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        const mapped: agreementType[] = (arr as any[]).map((item: any) => {

        return {
            idAgreement: item.idAgreement,
            fixDiscount: numeroParaMoeda(item.fixDiscount) ?? '---',
            percentageDiscount: formatPercentage(item.percentageDiscount) ?? '---',
            dateExpiration: item.dateExpiration.split('-').reverse().join('/'),
            dateRegister: item.dateRegister.split('-').reverse().join('/'),
            idClient: item.idClient,
            enterpriseName: item.client?.name ?? '---'
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

  async function fetchClientEnterprises() {
      const enterpriseParams = {
        idClientType: 2
      }
      try {
        const activeEnterprisesRes = await requestPRSYS('client', '', 'GET', undefined, enterpriseParams);
  
        setClientEnterprises(activeEnterprisesRes.map(c => ({
          id: c.idClient,
          label: c.name 
        } as SelectOption))); 
      } catch(err) {
        toast.error('Erro ao consultar empresas', errorToastStyle);
      }
    }

  const filters: FilterField[] = [  
    { key: "idClient", label: "Empresa", 
      type: "select",
      options: agreementEnterprises
    },
    { key: "dateExpiration", label: "Data inicial", 
      type: "text",
      placeholder: "dd/mm/yyyy", 
      mask: () => "dd/mm/yyyy", 
      replacement: { d: /\d/, m: /\d/, y: /\d/ }
    },
    { key: "dateRegister", label: "Data final", 
      type: "text",
      placeholder: "dd/mm/yyyy", 
      mask: () => "dd/mm/yyyy", 
      replacement: { d: /\d/, m: /\d/, y: /\d/ }
    },
  ];

  const columns: TableColumn<agreementType>[] = [
    { key: "enterpriseName", label: "Empresa" },
    { key: "fixDiscount", label: "Desconto Fixo" },
    { key: "percentageDiscount", label: "Desconto Percentual" },
    { key: "dateRegister", label: "Data de cadastro" },
    { key: "dateExpiration", label: "Data de expiração" }
  ];

  const actions = [
    {
      key: "view",
      label: "Visualizar",
      icon: <PencilIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: agreementType) => {
        handleEdit(row);
      },
    },
   /* {
      key: "delete",
      label: "Deletar",
      icon: <TrashIcon size={14} />,
      className: 'icon-btn-delete',
      onClick: (row: agreementType) => {
        handleDelete(String(row.idVehicle!));
      },
    }*/
  ];

   const handleSearch = async (values: Record<string, any>) => {
    
    const idClient = values.idClient;
    const dateExpiration = values.dateExpiration ? String(values.dateExpiration) : null;
    const dateRegister = values.dateRegister ? String(values.dateRegister) : null;
    
    if (!idClient && !dateExpiration && !dateRegister) {
      setFiltered(null);
      return;
    }

    setLoading(true);
    try {
      
      const params = {
        idClient: idClient,
        dateExpirationStart: String(dateExpiration?.split('/').reverse().join('-')) || null,
        dateExpirationEnd: String(dateRegister?.split('/').reverse().join('-')) || null
      }
      
      const response = await requestPRSYS('agreement', '', 'GET', undefined, params);
      const arr = Array.isArray(response) ? response : response?.data ?? [];

      if(response.length < 1 || !response){
        toast.error('Nenhum dado para esses filtros', errorToastStyle);
      }
      
      const mapped: agreementType[] = (arr as any[]).map((item: any) => ({
          idAgreement: item.idAgreement,
          fixDiscount: numeroParaMoeda(item.fixDiscount) ?? '---',
          percentageDiscount: formatPercentage(item.percentageDiscount) ?? '---',
          dateExpiration: item.dateExpiration.split('-').reverse().join('/'),
          dateRegister: item.dateRegister.split('-').reverse().join('/'),
          idClient: item.idClient,
          enterpriseName: item.client?.name ?? '---'
      }));
  
      setFiltered(mapped);

    } catch (err) {
      toast.error('Verifique os filtros para estarem no padrão correto', errorToastStyle);
      console.error("handleSearch erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsAgreementModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    /*setAgreementDetail({
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
    setIsAgreementModalOpen(true);
  };

  useEffect(() => {
    if(!isAgreementModalOpen) {
      setAgreementDetail(undefined);
      fetchConvenios();
    }
  }, [isAgreementModalOpen])

  const rowsToShow = filtered ?? rows;

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Convenios" actionLabel="Cadastrar Convênio" onAction={handleCreate} onAction2={handleEdit} actionIcon={<HandshakeIcon size={20} />} />
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
            title="Listagem de Convênios"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rowsToShow.length}
            /*onGenerateCSV={handleGenerateCSV}*/
          />
      }
    </main>
    {isAgreementModalOpen && <AgreementModal isOpen={isAgreementModalOpen} closeModal={() => setIsAgreementModalOpen(false)} agreement={agreementDetail}/>}
  </>);
}