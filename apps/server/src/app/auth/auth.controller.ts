import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express';
import { join } from 'path';

import { TokenDto } from '@bella/shared';

import { AuthService } from './auth.service';
import { Auth, DcUser } from './guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @ApiOkResponse({
    description: 'Login url - redirects to discord auth page',
  })
  async getUserFromDiscordLogin(@Res() res: Response) {
    return this.authService.login(res);
  }

  @Get('callback')
  @ApiOkResponse({
    description: 'Returns temporary client to resend token info',
  })
  async discordCallback(@Res() res: Response) {
    return res.sendFile(join(__dirname, 'assets', 'index.html'));
  }

  @Post('save')
  @ApiOkResponse({
    description: 'Save and cache token in cookies',
  })
  getEntity(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.validate(req, res);
  }

  @Auth()
  @Get('me')
  @ApiOkResponse({
    type: TokenDto,
    description: 'Manual check for authed user',
  })
  getMe(@DcUser() user: TokenDto) {
    return this.authService.verify(user);
  }
}
