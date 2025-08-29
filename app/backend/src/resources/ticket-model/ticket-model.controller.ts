import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TicketModelService } from './ticket-model.service';
import { TicketModel } from './ticket-model.entity';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { GetTicketModelsDto } from './dto/get-ticket-models-dto';
import { CreateTicketModelDto } from './dto/create-ticket-model-dto';
import { EditTicketModelDto } from './dto/edit-ticket-model-dto';

@Controller('ticket-model')
export class TicketModelController {
    constructor(private readonly ticketModelService: TicketModelService) {}

    @Get('')
    async getTicketModels(@Query() getTicketModelsDto: GetTicketModelsDto): Promise<TicketModel[]> {
        const [httpError, ticketModels] = await promiseCatchErrorHTTPDefault(this.ticketModelService.getTicketModels(getTicketModelsDto));
        if(httpError) throw httpError;
        
        return ticketModels;
    }

    @Post('')
    async createTicketModel(@Body() createTicketModelDto: CreateTicketModelDto): Promise<TicketModel> {
        const [httpError, ticketModel] = await promiseCatchErrorHTTPDefault(this.ticketModelService.createTicketModel(createTicketModelDto));
        if(httpError) throw httpError;

        return ticketModel;
    }

    @Put(':idTicketModel')
    async editTicketModel(@Param('idTicketModel') idTicketModel: number, @Body() editTicketModelDto: EditTicketModelDto): Promise<TicketModel> {
        const [httpError, ticketModel] = await promiseCatchErrorHTTPDefault(this.ticketModelService.editTicketModel(idTicketModel, editTicketModelDto));
        if(httpError) throw httpError;

        return ticketModel;
    }

    @Delete(':idTicketModel')
    async deleteTicketModel(@Param('idTicketModel') idTicketModel: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.ticketModelService.deleteTicketModel(idTicketModel));
        if(httpError) throw httpError;
    }

    @Put(':idTicketModel')
    async manageTicketModelActivity(@Param('idTicketModel') idTicketModel: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.ticketModelService.manageTicketModelActivity(idTicketModel));
        if(httpError) throw httpError;
    }
}
