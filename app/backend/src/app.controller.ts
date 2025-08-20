import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller('')
export class AppController {
    constructor() {}

    @Public()
    @Get('health')
    async health(): Promise<boolean> { return true };
}
