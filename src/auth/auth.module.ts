import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { AuthUtil } from './auth.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret,
        };
      },
    }),
  ],
  providers: [AuthGuard, RoleGuard, AuthUtil],
  exports: [AuthGuard, RoleGuard, AuthUtil, JwtModule],
})
export class AuthModule {}
