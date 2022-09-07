import { ZEngineFunction } from '../core/ZEngine';

export class EnumValFunction implements ZEngineFunction<any,string> {

  private static PATTERN = /([a-z])([A-Z])/g

  apply(data?: any): string {
    const val: string = (typeof data === 'string') ? data : data.toString();
    const len = val?.trim().length || 0;
    return ((len > 3) ? val.replace(EnumValFunction.PATTERN, "$1_$2") : val).toUpperCase();
  }
}
