import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthUtil {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 토큰을 발급합니다.
   * @param {T} payload
   * @returns {string} expiresIn
   */
  createToken<T extends object>(payload: T, expiresIn: string): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  /**
   * 토큰을 검증합니다.
   * @param token
   * @returns
   */
  verifyToken<T extends object>(token: string): T {
    try {
      return this.jwtService.verify<T>(token);
    } catch (error) {
      throw new Error('요청 시간이 만료했습니다. 다시 시도해 주세요.');
    }
  }

  /**
   * 평문과 암호화된 문자열을 비교합니다.
   * @param {string} plain
   * @param {string} hash
   * @returns {boolean} isSame
   */
  compareHash(plain: string, hash: string): boolean {
    return compareSync(plain, hash);
  }
}
