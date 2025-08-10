import { Injectable } from '@nestjs/common';
import { Access } from './entities/access.entity';
import { LoginDto } from './dto/login-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import { AuthTokenDto } from './dto/auth-token-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../../mail/mail.service';
import { randomBytes } from 'crypto';
import { EncryptionService } from 'src/encryption/encryption.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Access)
        private readonly acessRepo: Repository<Access>,
        private readonly mailService: MailService,
        private readonly encryptService: EncryptionService,
        private readonly authService: AuthService
    ) {}

    async getDefault(justUsername: boolean): Promise<Access|string> {
        const firstCreatedAccess = await this.acessRepo
            .findOne({
                order: {
                    idAccess: "ASC"
                }
            });
        if(firstCreatedAccess == null)
            return '';

        if(justUsername) 
            return firstCreatedAccess.username;

        return firstCreatedAccess;
    }

    generateSimplePassword(size: number = 12) {
        const buf = randomBytes(size);
        return buf.toString('base64url').slice(0, size);
    }

    async forgotPassword(idAccess: number): Promise<boolean> {
        const access = await this.acessRepo
            .findOne({
                where: { idAccess: idAccess }
            });
        if(access == null) 
                return false;

        const newPassword = this.generateSimplePassword();
        const newPasswordEncrypted = this.encryptService.encrypt(newPassword);

        try {
            access.password = newPasswordEncrypted;
            await this.acessRepo.save(access);

            await this.mailService.sendResetPassword(
                access.email,
                access.username,
                newPassword
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    async login(loginDto: LoginDto): Promise<AuthTokenDto | null> {
        const loginAccess = await this.acessRepo
            .findOne({where: {
                username: loginDto.username
            }});
        if(loginAccess === null) return null;

        const isWrongPassword = this.encryptService.decrypt(loginAccess.password) == loginDto.password;
        if(isWrongPassword) return null;
        
        const authToken = await this.authService.signPayload({ 
            idAccess: loginAccess.idAccess,
            username: loginAccess.username 
        });

        return { authToken: authToken };
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<AuthTokenDto | null> {
        const loginAccess = await this.acessRepo
            .findOne({where: {
                username: changePasswordDto.username
            }});
        if(loginAccess === null) return null;

        const isWrongPassword = this.encryptService.decrypt(loginAccess.password) == changePasswordDto.password;
        if(isWrongPassword) return null;
        
        const newPasswordEncrypted = this.encryptService.encrypt(changePasswordDto.newPassword);
        loginAccess.password = newPasswordEncrypted;
        await this.acessRepo.save(loginAccess);

        return this.login({
            username: changePasswordDto.username,
            password: changePasswordDto.newPassword
        });
    }
}
