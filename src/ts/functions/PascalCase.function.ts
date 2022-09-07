import { ZEngineFunction } from '../core/ZEngine';

export class PascalCaseFunction implements ZEngineFunction<any,string> {
  apply(data?: any): string {
    const val: string = (typeof data === 'string') ? data : data.toString();
    const len = val?.trim().length || 0;
    return (len > 1) ? `${val.substring(0,1).toUpperCase()}${val.substring(1, len)}` : val.toUpperCase();
  }
}
