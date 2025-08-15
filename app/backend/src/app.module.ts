import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ResourceModule } from './resources/resource.module';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        ResourceModule
    ],
})
export class AppModule {}
