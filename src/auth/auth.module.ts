import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { AuthUtil } from './auth.util';
import { RoleGuard } from './guards/role.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
  providers: [AuthGuard, RoleGuard, AuthUtil],
  exports: [AuthGuard, RoleGuard, AuthUtil, JwtModule],
})
export class AuthModule {}
