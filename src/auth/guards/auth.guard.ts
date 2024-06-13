import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthUtil } from '../auth.util';
import { AccessTokenPayload } from 'src/common/types/token-payload.type';
import { USER_ACCESS_TOKEN_KEY } from 'src/common/const/token-key.const';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authUtil: AuthUtil) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const cookies = request.cookies;

    const accessToken = cookies[USER_ACCESS_TOKEN_KEY];

    if (!accessToken) {
      request.res.clearCookie();
      this.logger.debug('⛔ Access Token을 찾을 수 없습니다.');
      throw new HttpException('사용자 정보를 찾을 수 없습니다.', 498);
    }

    let payload: AccessTokenPayload;
    try {
      payload = this.authUtil.verifyToken<AccessTokenPayload>(accessToken);
    } catch (e) {
      this.logger.debug('⛔ Access Token이 유효하지 않습니다.');
      request.res.clearCookie();
      throw new HttpException('사용자 정보를 찾을 수 없습니다.', 498);
    }
    if (!payload) {
      this.logger.debug('⛔ 사용자 정보를 찾을 수 없습니다.');
      request.res.clearCookie();
      throw new HttpException('사용자 정보를 찾을 수 없습니다.', 498);
    }

    const { id } = payload;

    if (!id) {
      return false;
    }

    return true;
  }
}
