import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client-dto';
import { Client } from './client.entity';
import { EditClientDto } from './dto/edit-client-dto';
import { GetActiveClientsDto } from './dto/get-active-clients-dto';
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

    async getActiveClients(getActiveClientsDto: GetActiveClientsDto): Promise<Client[]> {
        try {
            const query = this.clientRepo
                .createQueryBuilder('client')
                    .innerJoinAndSelect('client.clientType', 'clientType')
                    .leftJoinAndSelect('client.clientEnterprise', 'clientEnterprise', 'clientEnterprise.isActive = true')
                    .leftJoinAndSelect('client.parkingServices', 'parkingServices')
                .where('client.isActive = true');

            if(typeof getActiveClientsDto.cpfCnpj !== 'undefined')
                query.andWhere('client.cpfCnpj = :cpfCnpj', { cpfCnpj: getActiveClientsDto.cpfCnpj });

            if(typeof getActiveClientsDto.name !== 'undefined')
                query.andWhere('client.name ILIKE :name', { name: `%${getActiveClientsDto.name}%` });

            if(typeof getActiveClientsDto.idClientType !== 'undefined')
                query.andWhere('clientType.idClientType = :idClientType', { idClientType: getActiveClientsDto.idClientType });

            const clients = await query.getMany();
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
            console.log(err);
            throw buildDatabaseError(err, {
                UKErrors: [
                    new ClientCpfCnpjExists()
                ]
            });
        }
    }

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
                clientEnterprise: typeof editClientDto.idClientEnterprise !== 'undefined' 
                    ?   { idClient: editClientDto.idClientEnterprise }
                    :   null
            }
        }));
        
        if(loadError)
            throw new DatabaseError();
        
        if(typeof clientData === 'undefined') throw new ClientNotExists();
        
        try {
            const updatedClient = await this.clientRepo.save(clientData);
            
            return updatedClient;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new ClientCpfCnpjExists()
                ]
            });
        }
    }

    // Soft delete
    async deleteClient(idClient: number): Promise<void> {
        const [clientError, client] = await promiseCatchError(this.clientRepo.findOne({ where: {
           idClient: idClient 
        }, relations: {
            agreements: true
        }}));
        if(clientError) throw new DatabaseError();
        if(client === null) throw new ClientNotExists();

        const currentAgreement = client.agreements.filter(a => a.isActive)[0]
        if(currentAgreement) currentAgreement.isActive = false;

        client.isActive = false;

        try {
            await this.clientRepo.save(client);
        } catch(err) {
            throw new DatabaseError();
        }
    }
}
