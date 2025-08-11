import { Injectable } from '@nestjs/common';
import { Access } from './access.entity';
import { LoginDto } from './dto/login-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import { AccessAuthDto } from './dto/access-auth-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { MailService } from '../../mail/mail.service';
import { randomBytes } from 'crypto';
import { EncryptionService } from 'src/encryption/encryption.service';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseError, UnexpectedError } from 'src/utils/app.errors';
import { promiseCatchError } from 'src/utils/utils';
import { DefaultAccessNotDefined, LoginNotExists, WrongPassword } from './access.errors';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Access)
        private readonly acessRepo: Repository<Access>,
        private readonly mailService: MailService,
        private readonly encryptService: EncryptionService,
        private readonly authService: AuthService
    ) {}

    async getDefault(seePassword: boolean): Promise<Access> {
        const [dbError, firstCreatedAccess] = await promiseCatchError(seePassword
            ? this.acessRepo
                .createQueryBuilder('access')
                .addSelect('access.password')
                .orderBy('access.idAccess', 'ASC')
                .getOne()
            : this.acessRepo
                .findOne({
                    order: {
                        idAccess: "ASC"
                    }
                })
        );
        if(dbError) throw new DatabaseError();

        if(firstCreatedAccess == null) throw new DefaultAccessNotDefined();

        return firstCreatedAccess;
    }

    generateSimplePassword(size: number = 12) {
        const buf = randomBytes(size);
        return buf.toString('base64url').slice(0, size);
    }

    async forgotPassword(idAccess: number): Promise<void> {
        const [dbError, access] = await promiseCatchError(this.acessRepo
            .findOne({
                where: { idAccess: idAccess }
            }));
        if(dbError) throw new DatabaseError();
        
        if(access == null) return;

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
        } catch (err) {
            if(err instanceof TypeORMError)
                throw new DatabaseError();
            
            throw new UnexpectedError();
        }
    }

    async login(loginDto: LoginDto): Promise<AccessAuthDto> {
        const [loginError, loginAccess] = await promiseCatchError(this.acessRepo
            .createQueryBuilder('access')
            .addSelect('access.password')
            .where('access.username = :username', { username: loginDto.username })
            .getOne());
        if(loginError) throw new DatabaseError();

        if(loginAccess === null) throw new LoginNotExists();

        const isWrongPassword = this.encryptService.decrypt(loginAccess.password) == loginDto.password;
        if(isWrongPassword) throw new WrongPassword();
        
        const authToken = await this.authService.signPayload({ 
            idAccess: loginAccess.idAccess,
            username: loginAccess.username 
        });

        return { 
            access: loginAccess,
            authToken: authToken 
        };
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<AccessAuthDto> {
        const [accessError, loginAuth] = await promiseCatchError(this.login({
            username: changePasswordDto.username,
            password: changePasswordDto.password
        }));
        if(accessError) throw accessError;

        const {access: loginAccess} = loginAuth;

        const newPasswordEncrypted = this.encryptService.encrypt(changePasswordDto.newPassword);
        loginAccess.password = newPasswordEncrypted;
       
        const [changePassDBError] = await promiseCatchError(this.acessRepo.save(loginAccess));
        if(changePassDBError) throw new DatabaseError();

        return this.login({
            username: changePasswordDto.username,
            password: changePasswordDto.newPassword
        });
    }
}
