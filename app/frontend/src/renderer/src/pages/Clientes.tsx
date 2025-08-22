import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon , CarIcon, MagnifyingGlassIcon, CurrencyDollarIcon } from "@phosphor-icons/react";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import ClienteModal from "@renderer/modals/ClienteModal/ClienteModal";
import { Toaster } from "react-hot-toast";
import { clientType } from "@renderer/types/resources/clientType";
import { requestPRSYS } from '@renderer/utils/http'

type ClientRow = {
  id: string;
  name: string;
  cpf_cnpj: string;
  phone?: string;
  email?: string;
  company?: string;
  type?: "cnpj" | "cpf";
};


export default function ClientesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [filtered, setFiltered] = useState<ClientRow[] | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [clientDetail, setClientDetail] = useState<clientType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await requestPRSYS('client', '', 'GET');
        // your response is an array at the root according to the example
        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        
        const mapped: ClientRow[] = (arr as any[]).map((item: any) => {
        
          //falta company nesse caralho ainda, vou ver dps, to indo embora
        return {
            id: String(item.idClient ?? item.id_client ?? item.id ?? ""),
            name: item.name ?? item.nome ?? "",
            cpf_cnpj: item.cpfCnpj,
            phone: item.phone ?? item.telefone ?? "",
            email: item.email ?? "",
            company: "",
            type: item.clientType.idClientType == 1 ? 'cpf' : 'cnpj'
          };
        });
        
        
        if (mapped.length) {
          setRows(mapped);
          setFiltered(null);
        } else {
          console.warn("fetchClient: no clients mapped, response:", response);
        }
        
        
        console.log("fetchClient response:", response);
      } catch (err) {
        console.error("fetchClient error:", err);
      } finally {
        setLoading(false);
      }
    };


  // Filters config (pass to GenericFilters)
  const filters: FilterField[] = [  
    { key: "cpf_cnpj", label: "CPF/CNPJ", type: "text", placeholder: "Digite o CPF/CNPJ" },
    { key: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
    {
      key: "types",
      label: "Tipo de cliente",
      type: "select",
      options: [
        { value: "cnpj", label: "CNPJ" },
        { value: "cpf", label: "CPF" },
      ],
    },
  ];

  // Table columns (pass to GenericTable)
  const columns: TableColumn<ClientRow>[] = [
    { key: "name", label: "Nome" },
    { key: "cpf_cnpj", label: "CPF/CNPJ" },
    { key: "phone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "company", label: "Empresa" },
    {
      key: "type",
      label: "Tipo de cliente",
      render: (r) => <span>{r.type}</span>,
    },
  ];

  // Actions for table rows (pass to GenericTable)
  const actions = [
    {
      key: "view",
      label: "Visualizar",
      icon: <MagnifyingGlassIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: ClientRow) => {
        navigate(`/clientes/${row.id}`);
      },
    },
    {
      key: "car",
      label: "Carro",
      icon: <CarIcon size={14} />,
      onClick: (row: ClientRow) => {
        navigate(`/clientes/${row.id}/car`);
      },
    },
    {
        key: 'money',
        label: 'Dinheiro',
        icon: <CurrencyDollarIcon size={14} />,
        className: "icon-btn-money",
        onClick: (row: ClientRow) => {
            navigate(`/clientes/${row.id}/money`);
        }
    }
  ];

  const handleSearch = (values: Record<string, any>) => {
      const cpfFilter = values.cpf_cnpj ? String(values.cpf_cnpj).replace(/\D/g, "") : "";
      const nameFilter = values.name ? String(values.name).toLowerCase() : "";
      const typeFilter = values.type ? String(values.type) : "";
      
      
      const filteredRows = rows.filter((r) => {
        if (cpfFilter && !String(r.cpf_cnpj).replace(/\D/g, "").includes(cpfFilter)) return false;
        if (nameFilter && !r.name.toLowerCase().includes(nameFilter)) return false;
        if (typeFilter && r.type !== typeFilter) return false;
        return true;
      });
      
      
      setFiltered(filteredRows);
    };

  const handleCreate = () => {
    setIsClientModalOpen(true);
  };
  const handleEdit = () => {
    setClientDetail({
      idClient: 12,
      name: "Zan",
      cpfCnpj: "13125125123",
      email: "zan@gmail.com",
      phone: "42132314232"
    });
    setIsClientModalOpen(true);
  };

  useEffect(() => {
    if(!isClientModalOpen) setClientDetail(undefined);
  }, [isClientModalOpen])


  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r) => ({
      Nome: r.name,
      CPF: r.cpf_cnpj,
      Telefone: r.phone,
      Email: r.email,
      Empresa: r.company,
      type: r.type,
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v ?? "")}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes_${Date.now()}.csv`;
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
      <GenericTop title="Clientes" actionLabel="Cadastrar Cliente" onAction={handleCreate} onAction2={handleEdit} actionIcon={<UserIcon size={20} />} />
      <GenericFilters fields={filters} onSearch={handleSearch} />
      <GenericTable
        title="Listagem de Clientes"
        columns={columns}
        rows={rowsToShow}
        actions={actions}
        perPage={5}
        total={rows.length}
        onGenerateCSV={handleGenerateCSV}
      />
    </main>
    {isClientModalOpen && <ClienteModal isOpen={isClientModalOpen} closeModal={() => setIsClientModalOpen(false)} client={clientDetail}/>}
  </>);
}
