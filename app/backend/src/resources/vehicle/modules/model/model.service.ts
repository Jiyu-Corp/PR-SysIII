import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promiseCatchError } from 'src/utils/utils';
import { Model } from './model.entity';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { ExistParkedVehicleWithinThatModel, ModelNotExists } from './model.errors';

@Injectable()
export class ModelService {
    constructor(
        @InjectRepository(Model)
        private readonly modelRepo: Repository<Model>
    ) {}

    async deleteModel(idModel: number): Promise<void> {
        // Check if exists car parked
        const [pServiceError, existParkedVehicles] = await promiseCatchError(this.modelRepo
            .exists({ where: {
                vehicles: {
                    parkingServices: {
                        isParking: true
                    }
                }
            }})
        );
        if(pServiceError) throw new DatabaseError();
        if(existParkedVehicles)
            throw new ExistParkedVehicleWithinThatModel();

        try {
            await promiseCatchError(this.modelRepo.delete(idModel))
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
