import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { Agreement } from './agreement.entity';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { CreateAgreementDto } from './dto/create-agreement-dto';
import { GetActiveAgreementsDto } from './dto/get-active-agreements-dto';
import { EditAgreementDto } from './dto/edit-agreement-dto';

@Controller('agreement')
export class AgreementController {
    constructor(private readonly agreementService: AgreementService) {}

    @Get('')
    async getActiveAgreements(@Query() getActiveAgreementsDto: GetActiveAgreementsDto): Promise<Agreement[]> {
        const [httpError, agreements] = await promiseCatchErrorHTTPDefault(this.agreementService.getActiveAgreements(getActiveAgreementsDto));
        if(httpError) throw httpError;
        
        return agreements;
    }

    @Post('')
    async createAgreement(@Body() createAgreementDto: CreateAgreementDto): Promise<Agreement> {
        const [httpError, agreement] = await promiseCatchErrorHTTPDefault(this.agreementService.createAgreement(createAgreementDto));
        if(httpError) throw httpError;

        return agreement;
    }

    @Put(':idAgreement')
    async editAgreement(@Param('idAgreement') idAgreement: number, @Body() editAgreementDto: EditAgreementDto): Promise<Agreement> {
        const [httpError, agreement] = await promiseCatchErrorHTTPDefault(this.agreementService.editAgreement(idAgreement, editAgreementDto));
        if(httpError) throw httpError;

        return agreement;
    }

    @Delete(':idAgreement')
    async deleteAgreement(@Param('idAgreement') idAgreement: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.agreementService.deleteAgreement(idAgreement));
        if(httpError) throw httpError;
    }
}
