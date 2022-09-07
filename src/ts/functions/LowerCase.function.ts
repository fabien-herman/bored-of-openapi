import { ZEngineFunction } from '../core/ZEngine';

export class LowerCaseFunction implements ZEngineFunction<any,string> {
  apply(data?: any): string {
    const val: string = (typeof data === 'string') ? data : data.toString();
    return val?.toLowerCase();
  }
}
