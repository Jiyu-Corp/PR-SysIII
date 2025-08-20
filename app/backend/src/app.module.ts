import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ResourceModule } from './resources/resource.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        ResourceModule
    ],
    controllers: [AppController]
})
export class AppModule {}
