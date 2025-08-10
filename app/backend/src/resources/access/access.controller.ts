import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccessService } from './access.service';
import { from, Observable } from 'rxjs';
import { LoginDto } from './dto/login-dto';
import { AuthTokenDto } from './dto/auth-token-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('access')
export class AccessController {
    constructor(private readonly accessService: AccessService) {}

    @Public()
    @Get('getDefault')
    getDefaultUsername(): Promise<string> {
        return this.accessService.getDefault(true) as Promise<string>;
    }

    @Public()
    @Post('forgotPassword')
    forgotPassword(@Body() body: { idAccess: number }): Promise<boolean> {
        return this.accessService.forgotPassword(body.idAccess);
    }

    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<AuthTokenDto | null> {
        return this.accessService.login(loginDto);
    }

    @Post('changePassword')
    changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<AuthTokenDto | null> {
        return this.accessService.changePassword(changePasswordDto);
    }
}
