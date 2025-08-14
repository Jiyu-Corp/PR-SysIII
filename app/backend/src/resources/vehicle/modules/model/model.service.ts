import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promiseCatchError } from 'src/utils/utils';
import { Model } from './model.entity';
import { Repository } from 'typeorm';
import { DatabaseError } from 'src/utils/app.errors';
import { ModelNotExists } from './model.errors';

@Injectable()
export class ModelService {
    constructor(
        @InjectRepository(Model)
        private readonly modelRepo: Repository<Model>
    ) {}

    async deleteModel(idModel: number): Promise<void> {
        const [modelError, result] = await promiseCatchError(this.modelRepo
            .update(idModel, { isActive: false })
        );
        if(modelError) throw new DatabaseError();
        if(result.affected === 0) throw new ModelNotExists();
    }
}
