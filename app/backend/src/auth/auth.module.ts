// src/auth/auth.module.ts

import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtHttpGuard } from './jwt-http.guard'
import { APP_GUARD } from '@nestjs/core';

@Global()
@Module({
  providers: [
    AuthService,
    JwtHttpGuard,
    {
      provide: APP_GUARD,
      useClass: JwtHttpGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
