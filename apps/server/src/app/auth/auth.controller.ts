import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { join } from 'path';
import { DCAdminServerRoles, ServerListEnum } from '@bella/enums';
import { TokenDto } from '@bella/dto';
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
  async getUserFromDiscordLogin() {
    return this.authService.login();
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
    description: 'Manual check for authed user',
  })
  getMe(@DcUser() user: TokenDto) {
    return this.authService.verify(user);
  }

  @Auth()
  @Get('me/:server')
  @ApiParam({
    name: 'server',
    enum: ServerListEnum,
    description: 'Which server to check',
  })
  @ApiOkResponse({
    description: 'Get user data from server',
  })
  getMeOnServer(@Param('server') server: ServerListEnum, @DcUser() user: TokenDto) {
    return this.authService.fetchMember(user, server);
  }

  @Auth()
  @Get('me/:server/roles')
  @ApiParam({
    name: 'server',
    enum: ServerListEnum,
    description: 'Which server to check',
  })
  @ApiOkResponse({
    description: 'Member roles',
  })
  getMineRolesOnServer(@Param('server') server: ServerListEnum, @DcUser() user: TokenDto) {
    return this.authService.fetchMemberRoles(user, server);
  }

  @Auth(DCAdminServerRoles.MOD_MEISTER)
  @Get('test')
  test() {
    return 'OK';
  }
}
