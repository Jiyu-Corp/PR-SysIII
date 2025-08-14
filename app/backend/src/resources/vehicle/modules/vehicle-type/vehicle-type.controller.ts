import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type-dto';
import { EditVehicleTypeDto } from './dto/edit-vehicle-type-dto';
import { VehicleType } from './vehicle-type.entity';

@Controller('vehicle-type')
export class VehicleTypeController {
    constructor(private readonly vehicleTypeService: VehicleTypeService) {}
    @Get('')
    async getActiveVehicleTypes(): Promise<VehicleType[]> {
        const [httpError, vehicleTypes] = await promiseCatchErrorHTTPDefault(this.vehicleTypeService.getActiveVehicleTypes());
        if(httpError) throw httpError;
        
        return vehicleTypes;
    }

    @Post('')
    async createVehicleType(@Body() createVehicleTypeDto: CreateVehicleTypeDto): Promise<VehicleType> {
        const [httpError, vehicleType] = await promiseCatchErrorHTTPDefault(this.vehicleTypeService.createVehicleType(createVehicleTypeDto));
        if(httpError) throw httpError;

        return vehicleType;
    }

    @Put(':idVehicleType')
    async editVehicleType(@Param('idVehicleType') idVehicleType: number, @Body() editVehicleTypeDto: EditVehicleTypeDto): Promise<VehicleType> {
        const [httpError, vehicleType] = await promiseCatchErrorHTTPDefault(this.vehicleTypeService.editVehicleType(idVehicleType, editVehicleTypeDto));
        if(httpError) throw httpError;

        return vehicleType;
    }

    @Delete(':idVehicleType')
    async deleteVehicleType(@Param('idVehicleType') idVehicleType: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.vehicleTypeService.deleteVehicleType(idVehicleType));
        if(httpError) throw httpError;
    }
}
