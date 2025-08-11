import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerError } from 'src/utils/app.errors';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendResetPassword(email: string, username: string, password: string): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Sua senha foi resetada',
                template: './forgot-password',
                context: {
                    username: username,
                    newPassword: password
                },
            });
        } catch(err) {
            throw new MailerError();
        }
    }
}