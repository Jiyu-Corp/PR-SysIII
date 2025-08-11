import { Injectable } from '@nestjs/common';
import { Park } from './park.entity';

@Injectable()
export class ParkService {
    async getDefaultPark(): Promise<Park> {
        
    }
}
