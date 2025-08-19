import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './access.entity';
import { MailModule } from '../../mail/mail.module';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Access]),
    MailModule,
    EncryptionModule
  ],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService]
})
export class AccessModule {}
