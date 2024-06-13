import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  USER_ACCESS_TOKEN_KEY,
  USER_REFRESH_TOKEN_KEY,
} from 'src/common/const/token-key.const';
import { AccessTokenPayload } from 'src/common/types/token-payload.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OptionalRoleGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userAccessToken = request.cookies[USER_ACCESS_TOKEN_KEY];

    if (!userAccessToken)
      throw new UnauthorizedException('로그인이 필요합니다.');

    if (userAccessToken) {
      const accessToken = request.cookies[USER_ACCESS_TOKEN_KEY];
      const refreshToken = request.cookies[USER_REFRESH_TOKEN_KEY];

      if (accessToken) {
        const { id } = this.jwtService.verify<AccessTokenPayload>(accessToken);
        const member = await this.prismaService.user.findUnique({
          where: { id },
        });

        if (member) request.member = member;
      }

      if (refreshToken) {
        const member = await this.prismaService.user.findUnique({
          where: { refreshToken },
        });

        if (member) request.member = member;
      }
    }

    return true;
  }
}
