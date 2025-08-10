import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<MailerOptions> => ({
        transport: {
            host: config.get<string>('SMTP_HOST'),
            port: config.get<number>('SMTP_PORT'),
            secure: false,
            auth: {
                user: config.get<string>('SMTP_USER'),
                pass: config.get<string>('SMTP_PWRD'),
            },
        },
        defaults: {
            from: `"No Reply" <${config.get<string>('SMTP_MAIL')}>`,
        },
        template: {
            dir: join(__dirname, '..', 'mail' ,'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    })
  })]
})

export class SMTPConfigModule { }
