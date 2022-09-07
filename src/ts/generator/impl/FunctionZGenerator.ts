import { BaseZGenerator } from '../BaseZGenerator';
import { ZEngineItem } from '../../core/ZEngine';
import { ZFunction } from '../../model/ZFunction';

export class FunctionZGenerator extends BaseZGenerator<ZFunction> {

  parse(list: {[key: string]: ZFunction}): ZEngineItem[] {
    return [];
  }
}
