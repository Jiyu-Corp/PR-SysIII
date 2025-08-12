import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { GetClientsDto } from './dto/get-clients-dto';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { CreateClientDto } from './dto/create-client-dto';
import { EditClientDto } from './dto/edit-client-dto';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get('')
    async getClients(@Query() getClientsDto: GetClientsDto): Promise<Client[]> {
        const [httpError, clients] = await promiseCatchErrorHTTPDefault(this.clientService.getClients(getClientsDto));
        if(httpError) throw httpError;

        return clients;
    }

    @Post('')
    async createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
        const [httpError, client] = await promiseCatchErrorHTTPDefault(this.clientService.createClient(createClientDto));
        if(httpError) throw httpError;

        return client;
    }

    @Put(':idClient')
    async editClient(@Param('idClient') idClient: number, @Body() editClientDto: EditClientDto): Promise<Client> {
        const [httpError, client] = await promiseCatchErrorHTTPDefault(this.clientService.editClient(idClient, editClientDto));
        if(httpError) throw httpError;

        return client;
    }

    @Delete(':idClient')
    async deleteClient(@Param('idClient') idClient: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.clientService.deleteClient(idClient));
        if(httpError) throw httpError;
    }
}
