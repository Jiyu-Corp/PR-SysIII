import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
        provide: 'CRYPT_KEY',
        useFactory: (config: ConfigService) => Buffer.from(
            config.get<string>('CRYPT_KEY') as string, 
            'base64'
        ),
        inject: [ConfigService]
    },
    EncryptionService
  ],
  exports: [EncryptionService]
})
export class EncryptionModule {}