import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendResetPassword(email: string, username: string, password: string) {
        return this.mailerService.sendMail({
            to: email,
            subject: 'Sua senha foi resetada',
            template: './forgot-password',
            context: {
                username: username,
                newPassword: password
            },
        });
    }
}