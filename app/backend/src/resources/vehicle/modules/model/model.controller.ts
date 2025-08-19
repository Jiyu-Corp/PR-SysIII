import { Controller, Delete, Param } from '@nestjs/common';
import { ModelService } from './model.service';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';

@Controller('model')
export class ModelController {
    constructor(private readonly modelService: ModelService) {}

    @Delete(':idModel')
    async deleteModel(@Param('idModel') idModel: number): Promise<void> {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.modelService.deleteModel(idModel));
        if(httpError) throw httpError;
    }
}
