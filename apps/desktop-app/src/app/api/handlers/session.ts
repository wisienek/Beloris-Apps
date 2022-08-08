import { session } from 'electron';
import { Cookies, IpcEventDto, TokenDto } from '@bella/shared';

export const getSession = async (): Promise<IpcEventDto<TokenDto>> => {
  let returnValue: IpcEventDto<TokenDto>;

  try {
    const [cookie] = await session.defaultSession.cookies.get({
      name: Cookies.DISCORD_TOKEN,
    });

    const cookieValue: TokenDto = JSON.parse(cookie.value);

    console.log(cookie, cookieValue);

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
