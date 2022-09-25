export class IpcEventDto<T> {
  failed: boolean;
  error?: Error;
  data?: T;
}
