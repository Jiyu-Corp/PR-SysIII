import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PWRD'),
        database: config.get<string>('DATABASE_DB'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: {
            rejectUnauthorized: false
        }
    })
  })]
})

export class DatabaseConfigModule { }
