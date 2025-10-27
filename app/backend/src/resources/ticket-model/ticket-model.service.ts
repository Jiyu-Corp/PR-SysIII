import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TicketModel } from './ticket-model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { GetTicketModelsDto } from './dto/get-ticket-models-dto';
import { CreateTicketModelDto } from './dto/create-ticket-model-dto';
import { buildDatabaseError, promiseCatchError } from 'src/utils/utils';
import { ActiveTicketModelAlreadyExists, TicketModelNameExists, TicketModelNotExists } from './ticket-model.errors';
import { EditTicketModelDto } from './dto/edit-ticket-model-dto';

@Injectable()
export class TicketModelService {
    constructor(
        @InjectRepository(TicketModel)
        private readonly ticketModelRepo: Repository<TicketModel>
    ) {}

    async getTicketModels(getTicketModelsDto: GetTicketModelsDto): Promise<TicketModel[]> {
        try {  
            const query = this.ticketModelRepo
                .createQueryBuilder('ticketModel')
                .where('1=1')
            
            if(getTicketModelsDto.name) {
                query.andWhere("ticketModel.name ILIKE :name", { 
                    name: `%${getTicketModelsDto.name}%` 
                });
            }

            if(getTicketModelsDto.dateRegisterStart && getTicketModelsDto.dateRegisterEnd) {
                query.andWhere('ticketModel.dateRegister BETWEEN :dateRegisterStart AND :dateRegisterEnd', { 
                    dateRegisterStart: getTicketModelsDto.dateRegisterStart,
                    dateRegisterEnd: getTicketModelsDto.dateRegisterEnd,
                })
            }
                
            const ticketModels = await query.getMany();
            
            return ticketModels;
        } catch (err) {
            throw new DatabaseError();
        }
    }

    // Just one model can be activated at same time, make it later
    async createTicketModel(createTicketModelDto: CreateTicketModelDto): Promise<TicketModel> {
        try {
            const ticketModelData = this.ticketModelRepo.create({ 
              ...createTicketModelDto,
              isActive: false 
            });
            const ticketModel = await this.ticketModelRepo.save(ticketModelData);

            return ticketModel;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new TicketModelNameExists()
                ]
            })
        }
    }

    async manageTicketModelActivity(idTicketModel: number): Promise<void> {
        const [loadError, ticketModel] = await promiseCatchError(this.ticketModelRepo.findOneBy({ idTicketModel }));
        if(loadError) throw new DatabaseError();
        if(ticketModel === null) throw new TicketModelNotExists();

        ticketModel.isActive = !ticketModel.isActive;
        if(ticketModel.isActive) {
          const [loadError, ticketModels] = await promiseCatchError(this.ticketModelRepo.find({where: {
            isActive: true
          }}));
          if(loadError) throw new DatabaseError();

          if(ticketModels.length > 0) throw new ActiveTicketModelAlreadyExists();
        }

        try {
            await this.ticketModelRepo.save(ticketModel);
        } catch(err) {
            throw new DatabaseError();
        }
    }
    
    async editTicketModel(idTicketModel: number, editTicketModelDto: EditTicketModelDto): Promise<TicketModel> {
        const [loadError, ticketModelData] = await promiseCatchError(this.ticketModelRepo.preload({
            idTicketModel: idTicketModel,
            ... {
                name: editTicketModelDto.name,
                header: editTicketModelDto.header,
                footer: editTicketModelDto.footer
            }
        }));
        
        if(loadError)
            throw new DatabaseError();
            
        if(typeof ticketModelData === 'undefined') throw new TicketModelNotExists();

        try {
            const updatedTicketModel = await this.ticketModelRepo.save(ticketModelData);
            
            return updatedTicketModel;
        } catch (err) {
            throw buildDatabaseError(err, {
                UKErrors: [
                    new TicketModelNameExists()
                ]
            });
        }
    }

    async deleteTicketModel(idTicketModel: number): Promise<void> {
        try {
            await promiseCatchError(this.ticketModelRepo.delete(idTicketModel))
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async getCurrentTicketModel(): Promise<TicketModel | null> {
        try {  
            const ticketModel = await this.ticketModelRepo.findOne({where: {
                isActive: true
            }, order: {
                dateRegister: "DESC"
            }});
            
            return ticketModel;
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
