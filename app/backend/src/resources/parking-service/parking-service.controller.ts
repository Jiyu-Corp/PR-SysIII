import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ParkingServiceService } from './parking-service.service';
import { ParkingService } from './parking-service.entity';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { CreateParkingServiceDto } from './dto/create-parking-service-dto';
import { ServiceValueDto } from './dto/service-value-dto';

@Controller('parking-service')
export class ParkingServiceController {
    constructor(private readonly parkingServiceService: ParkingServiceService) {}

    @Get('getOpenServices')
    async getOpenServices(): Promise<ParkingService[]> {
        const [httpError, services] = await promiseCatchErrorHTTPDefault(this.parkingServiceService.getOpenServices());
        if(httpError) throw httpError;

        return services;
    }
    
    @Post('createService')
    async createService(@Body() createParkingServiceDto: CreateParkingServiceDto): Promise<ParkingService> {
        const [httpError, service] = await promiseCatchErrorHTTPDefault(this.parkingServiceService.createService(createParkingServiceDto));
        if(httpError) throw httpError;

        return service;
    }

    // editService, maybe remove it

    @Get('getServiceValues/:idParkingService')
    async getServiceValues(@Param('idParkingService') idParkingService: number): Promise<ServiceValueDto[]> {
        const [httpError, service] = await promiseCatchErrorHTTPDefault(this.parkingServiceService.getServiceValues(idParkingService));
        if(httpError) throw httpError;

        return service;
    }

    // finishService

    @Delete('cancelService/:idParkingService')
    async cancelService(@Param('idParkingService') idParkingService: number): Promise<void> {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.parkingServiceService.cancelService(idParkingService));
        if(httpError) throw httpError;
    }
}
