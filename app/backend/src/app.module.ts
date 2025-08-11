import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { AccessModule } from './resources/access/access.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    AccessModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
