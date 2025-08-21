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

type ClientRow = {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
  email?: string;
  company?: string;
  type?: "cnpj" | "cpf";
};

const SAMPLE_ROWS: ClientRow[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "131.200.739-64",
    phone: "(42) 9 9981-3748",
    email: "joao@ex.com",
    company: "Orsted Corp",
    type: "cnpj",
  },
  {
    id: "2",
    name: "Maria Souza",
    cpf: "987.654.321-00",
    phone: "(41) 9 9123-4567",
    email: "maria@ex.com",
    company: "Acme Ltd",
    type: "cpf",
  },
];

export default function ClientesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ClientRow[]>(SAMPLE_ROWS);
  const [filtered, setFiltered] = useState<ClientRow[] | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [clientDetail, setClientDetail] = useState<clientType | undefined>(undefined);

  // Filters config (pass to GenericFilters)
  const filters: FilterField[] = [  
    { key: "cpf", label: "CPF/CNPJ", type: "text", placeholder: "Digite o CPF/CNPJ" },
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
    { key: "cpf", label: "CPF/CNPJ" },
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

    const filteredRows = rows.filter((r) => {
      if (values.cpf && !r.cpf.includes(values.cpf)) return false;
      if (values.name && !r.name.toLowerCase().includes(String(values.name).toLowerCase())) return false;
      if (values.type && r.type !== values.type) return false;
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
      CPF: r.cpf,
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
