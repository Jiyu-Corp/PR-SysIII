import { Inject, Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import type { CipherGCMTypes } from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly encryptAlgorithm: CipherGCMTypes = 'aes-256-gcm';
    private readonly ivLength = 12;
    private readonly authTagLength = 16;

    constructor(
        @Inject('CRYPT_KEY') private readonly key: Buffer,
    ) {}

    encrypt(text: string): string {
        const iv = randomBytes(this.ivLength);
        const cipher = createCipheriv(this.encryptAlgorithm, this.key, iv);

        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return Buffer.concat([iv, tag, encrypted]).toString('base64');
    }

    decrypt(enc: string): string {
        const data = Buffer.from(enc, 'base64');

        const iv = data.subarray(0, this.ivLength);
        const tag = data.subarray(this.ivLength, this.ivLength + this.authTagLength);
        const encrypted = data.subarray(this.ivLength + this.authTagLength);

        const decipher = createDecipheriv(this.encryptAlgorithm, this.key, iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    }
}