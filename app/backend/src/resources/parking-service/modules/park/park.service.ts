import { Injectable } from '@nestjs/common';
import { Park } from './park.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultParkNotExists } from './park.errors';
import { DatabaseError, ExpectedError } from 'src/utils/app.errors';

@Injectable()
export class ParkService {
    constructor(
        @InjectRepository(Park)
        private readonly parkRepo: Repository<Park>
    ) {}

    async getDefaultPark(): Promise<Park> {
        try {
            const [park] = await this.parkRepo.find({order: {
                idPark: 'ASC'
            }, take: 1});
            if(park == null) throw new DefaultParkNotExists();

            return park;
        } catch(err) {
            if(err instanceof ExpectedError) throw err;
            
            throw new DatabaseError();
        }
    }
}
