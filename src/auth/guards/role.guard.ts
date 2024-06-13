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
export class RoleGuard implements CanActivate {
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

      if (!accessToken) throw new UnauthorizedException('로그인이 필요합니다.');

      const { id } = this.jwtService.verify<AccessTokenPayload>(accessToken);
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) throw new UnauthorizedException('로그인이 필요합니다.');

      const refreshToken = request.cookies[USER_REFRESH_TOKEN_KEY];

      if (!refreshToken)
        throw new UnauthorizedException('로그인이 필요합니다.');

      if (user.refreshToken !== refreshToken) {
        await this.prismaService.user.update({
          where: { id },
          data: { refreshToken: null },
        });
        throw new UnauthorizedException('로그인이 필요합니다.');
      }

      request.user = user;

      return true;
    }
    throw new UnauthorizedException('접근 권한이 없습니다.');
  }
}
