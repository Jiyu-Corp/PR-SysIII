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
import { numeroParaMoeda, formatPercentage, getErrorMessage } from "@renderer/utils/utils";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import Swal from 'sweetalert2';
import { PrsysError } from "@renderer/types/prsysErrorType";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";


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
              fixDiscountEdit: item.fixDiscount,
              percentageDiscountEdit: item.percentageDiscount,
              percentageDiscount: formatPercentage(item.percentageDiscount) ?? '---',
              dateExpiration: item.dateExpiration.split('-').reverse().join('/'),
              dateRegister: item.dateRegister.split('-').reverse().join('/'),
              idClient: item.client.idClient,
              enterpriseName: item.client?.name ?? '---'
            };
        });        
        
        if (mapped.length) {
          setRows(mapped);
          setFiltered(null);
        } else {
          console.warn("fetchConvenio: response:", response);
        }
        
      } catch (err) {
        console.error("fetchConvenio error:", err);
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
    {
      key: "dateExpiration",
      label: "Data inicial",
      type: "date"
    },
    {
      key: "dateRegister",
      label: "Data final",
      type: "date"
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
    {
      key: "delete",
      label: "Excluir",
      icon: <TrashIcon size={14} />,
      className: 'icon-btn-delete',
      onClick: (row: agreementType) => {
        handleDelete(String(row.idAgreement!));
      },
    }
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
        dateExpirationStart: dateExpiration?.split('/').reverse().join('-'),
        dateExpirationEnd: dateRegister?.split('/').reverse().join('-') 
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
    setAgreementDetail({
      idAgreement: row.idAgreement,
      fixDiscount: row.fixDiscount === '---' ? '' : row.fixDiscountEdit,
      percentageDiscount: row.percentageDiscount === '---' ? '' : row.percentageDiscountEdit,
      dateExpiration: row.dateExpiration,
      idClient: row.idClient   
    });
    setIsAgreementModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir este convênio?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS("agreement", `${id}`, "DELETE");
        toast.success("convênio excluído com sucesso!", successToastStyle);
        fetchConvenios();
      }
    } catch (error) {
      console.error("Erro ao excluir convênio:", error);
      toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
    }
  };

  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r: any) => ({
      Empresa: r.enterpriseName,
      Desconto: r.fixDiscount,
      Percentual: r.percentageDiscount,
      Cadastro: r.dateRegister,
      Expiração: r.dateExpiration
    }));
  
    if (!data.length) return;
  
    const escapeValue = (v: any) =>
      `"${String(v ?? "").replace(/"/g, '""')}"`;
  
    const header = Object.keys(data[0]).map((h) => escapeValue(h)).join(";");
    const body = data
      .map((row) => Object.values(row).map((v) => escapeValue(v)).join(";"))
      .join("\n");
  
    const csv = `${header}\n${body}`;
  
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `convenios.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <GenericFilters title="Convenios" fields={filters} onSearch={handleSearch} buttons={[
        <ButtonModal key={0} text="Cadastrar Convenio" action={handleCreate} color="#FFFFFF" backgroundColor="#3BB373" icon={HandshakeIcon}/>
      ]}/>
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
            onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
    {isAgreementModalOpen && <AgreementModal isOpen={isAgreementModalOpen} closeModal={() => setIsAgreementModalOpen(false)} agreement={agreementDetail}/>}
  </>);
}