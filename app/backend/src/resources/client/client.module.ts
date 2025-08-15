import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientTypeModule } from './modules/client-type/client-type.module';
import { AgreementModule } from './modules/agreement/agreement.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Client]),
        AgreementModule,
        ClientTypeModule
    ],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
