import { Module } from '@nestjs/common';
import { TicketModelService } from './ticket-model.service';
import { TicketModelController } from './ticket-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketModel } from './ticket-model.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TicketModel])
    ],
    controllers: [TicketModelController],
    providers: [TicketModelService],
})
export class TicketModelModule {}
