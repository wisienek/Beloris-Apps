import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokenDto } from '@bella/dto';
import { NavbarService } from './navbar.service';
import { Auth, DcUser } from '../auth';

@ApiTags('Uploader - Navbar')
@Controller('navbar')
export class NavbarController {
  constructor(private navbarService: NavbarService) {}

  @Auth()
  @Get('options')
  getNavbarOptions(@DcUser() user: TokenDto) {
    return this.navbarService.getNavbarOptions(user);
  }
}
