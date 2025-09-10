import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon , TrashIcon, PencilIcon } from "@phosphor-icons/react";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import ClienteModal from "@renderer/modals/ClienteModal/ClienteModal";
import { toast, Toaster } from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { clientType, ClientRow } from "@renderer/types/resources/clientType";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import Swal from 'sweetalert2';
import { formatCpfCnpj, formatPhone, getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";

export default function ClientesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [filtered, setFiltered] = useState<ClientRow[] | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [clientDetail, setClientDetail] = useState<clientType | undefined>(undefined);
  const [loading, setLoading] = useState(false);  
  const cpfCpnjUnformater = (value: string) => value.replace(/\D/g, "");

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await requestPRSYS('client', '', 'GET');
        
        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        const mapped: ClientRow[] = (arr as any[]).map((item: any) => {

        return {
            id: String(item.idClient ?? item.id_client ?? item.id ?? ""),
            name: item.name ?? item.nome ?? "",
            cpf_cnpj: formatCpfCnpj(item.cpfCnpj),
            phone: item.phone ? formatPhone(item.phone) : '---',
            email: item.email ?? "---",
            enterprise: item.clientEnterprise ? item.clientEnterprise.name : "----",
            type: item.clientType.description,
            idClientEnterprise: item.clientEnterprise ? String(item.clientEnterprise.idClient) : undefined
          };
        });        
        
        if (mapped.length) {
          setRows(mapped);
          setFiltered(null);
        } else {
          console.warn("fetchClient: response:", response);
        }
        
      } catch (err) {
        console.error("fetchClient error:", err);
      } finally {
        setLoading(false);
      }
  };

  const filters: FilterField[] = [  
    { key: "cpf_cnpj", label: "CPF/CNPJ", 
      mask: (cpfCnpj: string) => cpfCpnjUnformater(cpfCnpj).length < 12 ? '___.___.___-__' : '__.___.___/____-__',
      replacement: { _: /\d/}, 
      type: "text",
      unformater: cpfCpnjUnformater
    },
    { key: "name", label: "Nome", type: "text"},
    {
      key: "type",
      label: "Tipo de cliente",
      type: "select",
      options: [
        { id: 2, label: "CNPJ" },
        { id: 1, label: "CPF" },
      ],
    },
  ];

  const columns: TableColumn<ClientRow>[] = [
    { key: "name", label: "Nome" },
    { key: "cpf_cnpj", label: "CPF/CNPJ" },
    { key: "phone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "enterprise", label: "Empresa" },
    {
      key: "type",
      label: "Tipo de cliente",
      render: (r) => <span>{r.type}</span>,
    },
  ];

  const actions = [
    {
      key: "view",
      label: "Visualizar",
      icon: <PencilIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: ClientRow) => {
        handleEdit(row);
      },
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <TrashIcon size={14} />,
      className: 'icon-btn-delete',
      onClick: (row: ClientRow) => {
        handleDelete(row.id);
      },
    }
  ];

  const handleSearch = async (values: Record<string, any>) => {
    const cpfFilter = values.cpf_cnpj ? String(values.cpf_cnpj).replace(/\D/g, "") : "";
    const nameFilter = values.name ? String(values.name).trim() : "";
    const typeFilter = values.type ? String(values.type) : '';
  
    if (!cpfFilter && !nameFilter && !typeFilter) {
      setFiltered(null);
      return;
    }
  
    setLoading(true);
    try {
      
      const params = {
        cpfCnpj: cpfFilter || undefined,
        name: nameFilter || undefined,
        idClientType: typeFilter || undefined,
      }
        
      const response = await requestPRSYS("client", '', "GET", undefined, params);
      const arr = Array.isArray(response) ? response : response?.data ?? [];
  
      if(response.length < 1){
        toast.error('Nenhum dado para esses filtros', errorToastStyle);
      }

      const mapped: ClientRow[] = (arr as any[]).map((item: any) => ({
        id: String(item.idClient),
        name: item.name,
        cpf_cnpj: formatCpfCnpj(item.cpfCnpj),
        phone: formatPhone(item.phone),
        email: item.email,
        enterprise: item.clientEnterprise ? item.clientEnterprise.name : "",
        type: item.clientType.description,
        idClientEnterprise: item.clientEnterprise ? String(item.clientEnterprise.idClient) : undefined
      }));
  
      setFiltered(mapped);

    } catch (err) {

      console.error("handleSearch erro:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = () => {
    setIsClientModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setClientDetail({
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
    });
    setIsClientModalOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir este cliente?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS("client", `${id}`, "DELETE");
        toast.success("Cliente excluído com sucesso!", successToastStyle);
        fetchClient();
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
    }
  };

  useEffect(() => {
    if(!isClientModalOpen) {
      setClientDetail(undefined);
      fetchClient();
    }
  }, [isClientModalOpen])


  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r) => ({
      Nome: r.name,
      CPF: r.cpf_cnpj,
      Telefone: r.phone,
      Email: r.email,
      Empresa: r.enterprise,
      Tipo: r.type,
    }));

    const csv = [
      Object.keys(data[0]).join(";"),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v ?? "")}"`).join(";")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes.csv`;
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
      <GenericFilters title="Clientes" fields={filters} onSearch={handleSearch} buttons={[
        <ButtonModal key={0} text="Cadastrar Cliente" action={handleCreate} color="#FFFFFF" backgroundColor="#3BB373" icon={UserIcon}/>
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
            title="Listagem de Clientes"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rowsToShow.length}
            onGenerateCSV={handleGenerateCSV}
          />
    }
    </main>
    {isClientModalOpen && <ClienteModal isOpen={isClientModalOpen} closeModal={() => setIsClientModalOpen(false)} client={clientDetail}/>}
  </>);
}
