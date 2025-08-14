import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client-dto';
import { Client } from './client.entity';
import { EditClientDto } from './dto/edit-client-dto';
import { GetClientsDto } from './dto/get-clients-dto';
import { DatabaseError } from 'src/utils/app.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { ClientCpfCnpjExists, ClientNotExists } from './client.errors';

@Injectable()
export class ClientService {
    private readonly ID_CLIENT_TYPE_CPF = 1;
    private readonly ID_CLIENT_TYPE_CNPJ = 2;

    constructor(
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>
    ) {}

    async getClients(getClientsDto: GetClientsDto): Promise<Client[]> {
        try {
            const clients = this.clientRepo.find({ where: {
                cpfCnpj: getClientsDto.cpfCnpj,
                name: getClientsDto.name,
                clientType: {
                    idClientType: getClientsDto.idClientType
                }
            }, relations: {
                clientEnterprise: true
            }});
            
            return clients;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async createClient(createClientDto: CreateClientDto): Promise<Client> {
        try {
            const clientData = this.clientRepo.create({
                name: createClientDto.name,
                cpfCnpj: createClientDto.cpfCnpj,
                clientType: {
                    idClientType: createClientDto.cpfCnpj.length === 11
                        ? this.ID_CLIENT_TYPE_CPF
                        : this.ID_CLIENT_TYPE_CNPJ
                },
                email: createClientDto.email,
                phone: createClientDto.phone,
                clientEnterprise: {
                    idClient: createClientDto.idClientEnterprise
                }
            });
            const client = await this.clientRepo.save(clientData);
            
            return client;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new ClientCpfCnpjExists()
                ]
            });
        }
    }

    // Here i am not checking existance of clientEnterprise, just not
    // What about unique CPF? we need to handle it here
    async editClient(idClient: number, editClientDto: EditClientDto): Promise<Client> {
        const [loadError, clientData] = await promiseCatchError(this.clientRepo.preload({
            idClient: idClient,
            ... {
                name: editClientDto.name,
                cpfCnpj: editClientDto.cpfCnpj,
                clientType: {
                    idClientType: editClientDto.cpfCnpj!.length === 11
                        ? this.ID_CLIENT_TYPE_CPF
                        : this.ID_CLIENT_TYPE_CNPJ
                },
                email: editClientDto.email,
                phone: editClientDto.phone,
                clientEnterprise: typeof editClientDto.idClientEnterprise === 'undefined' 
                    ?   { idClient: editClientDto.idClientEnterprise }
                    :   null
            }
        }));
        
        if(loadError)
            throw buildDatabaseError(loadError, {
                UKErrors: [
                    new ClientCpfCnpjExists()
                ]
            });
        
        if(typeof clientData === 'undefined') throw new ClientNotExists();

        try {
            const updatedClient = await this.clientRepo.save(clientData);
            
            return updatedClient;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async deleteClient(idClient: number): Promise<void> {
        const [clientError, result] = await promiseCatchError(this.clientRepo
            .update(idClient, { isActive: false })
        );
        if(clientError) throw new DatabaseError();
        if(result.affected === 0) throw new ClientNotExists();
    }
}
