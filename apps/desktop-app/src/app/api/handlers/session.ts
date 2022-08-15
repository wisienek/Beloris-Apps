import { session } from 'electron';
import { IpcEventDto, TokenDto } from '@bella/dto';
import { CookiesEnum } from '@bella/enums';

export const getSession = async (): Promise<IpcEventDto<TokenDto>> => {
  let returnValue: IpcEventDto<TokenDto>;

  try {
    const [cookie] = await session.defaultSession.cookies.get({
      name: CookiesEnum.DISCORD_TOKEN,
    });

    if (!cookie) throw new Error(`Brak ciasteczka!`);
    console.log(`Cookie`, cookie);

    const cookieValue: TokenDto = JSON.parse(decodeURIComponent(cookie.value));

    console.log(`cookieValue`, cookieValue);

    returnValue = {
      failed: false,
      data: cookieValue,
    };
  } catch (err) {
    returnValue = {
      failed: true,
      error: err,
    };
  }

  return returnValue;
};

export const logout = async (): Promise<IpcEventDto<boolean>> => {
  let returnValue: IpcEventDto<boolean>;

  try {
    await session.defaultSession.cookies.remove('/', CookiesEnum.DISCORD_TOKEN);

    console.log(`Deleted cookie ${CookiesEnum.DISCORD_TOKEN} from "/"`);

    returnValue = {
      failed: false,
      data: true,
    };
  } catch (err) {
    returnValue = {
      failed: true,
      error: err,
    };
  }

  return returnValue;
};
