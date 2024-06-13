import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserDTO } from './dtos/user.dto';
import { AuthUtil } from 'src/auth/auth.util';
import { plainToInstance } from 'class-transformer';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/common/types/token-payload.type';
import {
  USER_ACCESS_TOKEN_KEY,
  USER_REFRESH_TOKEN_KEY,
} from 'src/common/const/token-key.const';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserLoginDTO } from './dtos/user-login.dto';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Request, Response } from 'express';
import { SearchResponseDTO } from 'src/common/dtos/search-response.dto';
import { SearchOptionDTO } from 'src/common/dtos/search-option.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authUtil: AuthUtil,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '내 정보를 조회합니다.',
  })
  @ApiOkResponse({ type: UserDTO })
  async getMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies[USER_ACCESS_TOKEN_KEY];
    const refreshToken = req.cookies[USER_REFRESH_TOKEN_KEY];

    if (accessToken) {
      const { id } = this.authUtil.verifyToken<AccessTokenPayload>(accessToken);
      const user = await this.userService.findById(id);
      if (!user) return null;
      return plainToInstance(UserDTO, user);
    } else if (refreshToken) {
      const user = await this.userService.findByRefreshToken(refreshToken);
      if (!user) return null;

      const accessToken = this.authUtil.createToken<AccessTokenPayload>(
        {
          id: user.id,
        },
        '6h',
      );

      res.cookie(USER_ACCESS_TOKEN_KEY, accessToken, {
        maxAge: 1000 * 60 * 60 * 6,
      });
      return plainToInstance(UserDTO, user);
    } else {
      return null;
    }
  }

  @Get()
  @Auth()
  @ApiOperation({
    summary: '사용자 전체 조회',
    description: '사용자 전체를 조회합니다.',
  })
  @ApiOkResponse({ type: UserDTO, isArray: true })
  async findAll() {
    return plainToInstance(UserDTO, await this.userService.findAll());
  }

  @Get('search')
  @ApiOperation({
    summary: '사용자 검색',
    description: '사용자를 검색합니다.',
  })
  @ApiOkResponse({
    type: SearchResponseDTO,
    schema: {
      items: {
        type: 'object',
        $ref: getSchemaPath(UserDTO),
      },
    },
  })
  async search(@Query() option: SearchOptionDTO) {
    const [admins, count] = await this.userService.search(option);

    return {
      items: plainToInstance(UserDTO, admins),
      pageInfo: {
        pageNo: option.pageNo,
        pageSize: option.pageSize,
        totalPages: Math.ceil(count / option.pageSize),
        totalItems: count,
        pageItems: admins.length,
      },
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '사용자 조회',
    description: '특정 사용자를 조회합니다.',
  })
  @ApiOkResponse({ type: UserDTO })
  async findById(@Param('id') id: string) {
    return plainToInstance(UserDTO, await this.userService.findById(id));
  }

  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입합니다.',
  })
  @ApiCreatedResponse({ type: UserDTO })
  async create(@Body() body: CreateUserDTO) {
    return plainToInstance(UserDTO, await this.userService.create(body));
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인을 합니다.',
  })
  @ApiQuery({
    name: 'auto',
    required: false,
    example: false,
    description: '자동 로그인 여부',
  })
  @ApiCreatedResponse({ type: UserDTO })
  async login(
    @Body() body: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
    @Query('auto') auto?: boolean,
  ) {
    const user = await this.userService.findByUsername(body.username);
    if (!user)
      throw new NotFoundException('아이디 또는 비밀번호가 일치하지 않습니다.');

    if (!compareSync(body.password, user.password))
      throw new NotFoundException('아이디 또는 비밀번호가 일치하지 않습니다.');

    const accessToken = this.authUtil.createToken<AccessTokenPayload>(
      {
        id: user.id,
      },
      '6h',
    );
    res.cookie(USER_ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 1000 * 60 * 60 * 6,
    });

    if (auto) {
      const refreshToken = this.authUtil.createToken<RefreshTokenPayload>(
        {
          id: user.id,
          isRefreshToken: true,
        },
        '30d',
      );

      await this.userService.setRefreshToken(user.id, refreshToken);

      res.cookie(USER_REFRESH_TOKEN_KEY, refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    return plainToInstance(UserDTO, user);
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 합니다.',
  })
  @Auth()
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie(USER_ACCESS_TOKEN_KEY);
    res.clearCookie(USER_REFRESH_TOKEN_KEY);

    await this.userService.setRefreshToken(user.id);

    return;
  }
}
