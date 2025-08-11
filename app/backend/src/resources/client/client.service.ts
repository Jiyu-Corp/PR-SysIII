import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client-dto';
import { Client } from './client.entity';
import { EditClientDto } from './dto/edit-client-dto';

@Injectable()
export class ClientService {
    async createClient(createClientDto: CreateClientDto): Promise<Client> {

    }

    async editClient(editClientDto: EditClientDto): Promise<Client> {
        
    }
}
