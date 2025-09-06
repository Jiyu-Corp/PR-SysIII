import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { GetParkedServicesDto } from './dto/get-parked-services-dto';
import { FinishedParkingServices } from './dto/finished-parking-services-dto';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('parkedServices')
    async getParkedServices(@Query() getParkedServicesDto: GetParkedServicesDto): Promise<FinishedParkingServices[]> {
        const [httpError, parkedServices] = await promiseCatchErrorHTTPDefault(this.reportService.getParkedServices(getParkedServicesDto));
        if(httpError) throw httpError;
        
        return parkedServices;
    }
}
