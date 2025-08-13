import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { GetVehiclesDto } from './dto/get-vehicles-dto';
import { Vehicle } from './vehicle.entity';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';
import { CreateVehicleDto } from './dto/create-vehicle-dto';
import { EditVehicleDto } from './dto/edit-vehicle-dto';

@Controller('vehicle')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    @Get('')
    async getVehicles(@Query() getVehiclesDto: GetVehiclesDto): Promise<Vehicle[]> {
        const [httpError, vehicles] = await promiseCatchErrorHTTPDefault(this.vehicleService.getVehicles(getVehiclesDto));
        if(httpError) throw httpError;
        
        return vehicles;
    }

    @Post('')
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        const [httpError, vehicle] = await promiseCatchErrorHTTPDefault(this.vehicleService.createVehicle(createVehicleDto));
        if(httpError) throw httpError;

        return vehicle;
    }

    @Put(':idVehicle')
    async editVehicle(@Param('idVehicle') idVehicle: number, @Body() editVehicleDto: EditVehicleDto): Promise<Vehicle> {
        const [httpError, vehicle] = await promiseCatchErrorHTTPDefault(this.vehicleService.editVehicle(idVehicle, editVehicleDto));
        if(httpError) throw httpError;

        return vehicle;
    }

    @Delete(':idVehicle')
    async deleteVehicle(@Param('idVehicle') idVehicle: number) {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.vehicleService.deleteVehicle(idVehicle));
        if(httpError) throw httpError;
    }    
}

//Wendel... lov this guy
//function ab(callback) {
//    // code
//    callback();
//}
