import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth';
import { TokenDto, NavbarOptionsDto, NavbarOption } from '@bella/dto';
import { DCAdminServerRoles, NavbarOptions, ServerListEnum } from '@bella/enums';

@Injectable()
export class NavbarService {
  private readonly navbarOptions: Record<NavbarOptions, NavbarOption[]> = {
    [NavbarOptions.PUBLIC]: [],
    [NavbarOptions.ADMIN]: [{ name: 'Edytowanie paczki', icon: 'ImportExportRounded', to: '/mods-wizard' }],
    [NavbarOptions.TESTING]: [
      { name: 'Skiny', icon: 'People' },
      { name: 'Powiadomienia', icon: 'Construction' },
    ],
  };

  constructor(private authService: AuthService) {}

  public async getNavbarOptions(userTokens: TokenDto): Promise<NavbarOptionsDto> {
    const [admin, user] = await Promise.all([
      this.authService.fetchMember(userTokens, ServerListEnum.BELORIS_ADMIN),
      this.authService.fetchMember(userTokens, ServerListEnum.BELORIS),
    ]);

    const availableOptions: NavbarOptionsDto = {};
    user && (availableOptions[NavbarOptions.PUBLIC] = this.navbarOptions[NavbarOptions.PUBLIC]);
    admin && (availableOptions[NavbarOptions.ADMIN] = this.navbarOptions[NavbarOptions.ADMIN]);
    admin.roles.some((role) => role === DCAdminServerRoles.TECHNICIAN || role === DCAdminServerRoles.MOD_MEISTER) &&
      (availableOptions[NavbarOptions.TESTING] = this.navbarOptions[NavbarOptions.TESTING]);

    return availableOptions;
  }
}
