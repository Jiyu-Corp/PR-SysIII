import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'

@Global()
@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    global: true,
    useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRE') },
        global: true,
    })
  })],
  exports: [JwtModule]
})
export class JwtConfigModule { }