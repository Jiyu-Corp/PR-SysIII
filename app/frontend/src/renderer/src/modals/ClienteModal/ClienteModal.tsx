import { useState } from "react";

type ClienteModalProps = {
	idClient: number;
	cpfCnpj: string;
	name: string;
	phone: string;
	email: string;
	enterprise: {
		idClient: number;
		name: string
	} 
};

export default function ClienteModal(client?: ClienteModalProps) {
  const idClient = client?.idClient;
	const [cpfCnpj, setCpfCnpj] = useState<string>(client?.cpfCnpj || '');
	const [name, setName] = useState<string>(client?.name || '');
	const [phone, setPhone] = useState<string>(client?.phone || '');
	const [email, setEmail] = useState<string>(client?.email || '');
	const [idClientEnterprise, setIdClientEnterprise] = useState<number | null>(client?.enterprise.idClient || null);

	return <div>
		
	</div>
}