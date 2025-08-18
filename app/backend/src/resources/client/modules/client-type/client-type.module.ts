import { Module } from '@nestjs/common';
import { ClientTypeService } from './client-type.service';
import { ClientTypeController } from './client-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientType } from './client-type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClientType])],
    controllers: [ClientTypeController],
    providers: [ClientTypeService],
    exports: [ClientTypeService]
})
export class ClientTypeModule {}
