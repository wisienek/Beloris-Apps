import { AxiosInstance } from 'axios';
import { ElectronLogger, getInstance } from '../utils';

export abstract class BaseHandler {
  protected readonly logger: ElectronLogger;
  protected readonly axiosInstance: AxiosInstance = getInstance();

  protected constructor(name: string) {
    this.logger = new ElectronLogger(name);
  }
}
