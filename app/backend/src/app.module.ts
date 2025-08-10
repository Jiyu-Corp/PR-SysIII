import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { AccessModule } from './resources/access/access.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,

    AccessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
