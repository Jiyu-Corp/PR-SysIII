import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AccessService } from './access.service';
import { LoginDto } from './dto/login-dto';
import { AccessAuthDto } from './dto/access-auth-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import { Public } from 'src/decorators/public.decorator';
import { promiseCatchErrorHTTPDefault } from 'src/utils/utils';

// Implement DTO validation 
@Controller('access')
export class AccessController {
    constructor(private readonly accessService: AccessService) {}

    @Public()
    @Get('getDefault')
    async getDefaultUsername(): Promise<string> {
        const [httpError, defaultAccess] = await promiseCatchErrorHTTPDefault(this.accessService.getDefault(true));
        if(httpError) throw httpError;

        return defaultAccess.username;
    }

    @Public()
    @Post('forgotPassword')
    async forgotPassword(): Promise<void> {
        const [httpError] = await promiseCatchErrorHTTPDefault(this.accessService.forgotPassword());
        if(httpError) throw httpError;
    }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<AccessAuthDto> {
        const [httpError, accessAuth] = await promiseCatchErrorHTTPDefault(this.accessService.login(loginDto));
        if(httpError) throw httpError;

        return accessAuth;
    }

    @Put('changePassword')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<AccessAuthDto> {
        const [httpError, accessAuth] = await promiseCatchErrorHTTPDefault(this.accessService.changePassword(changePasswordDto));
        if(httpError) throw httpError;

        return accessAuth;
    } 
}
