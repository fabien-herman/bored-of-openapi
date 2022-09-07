import { ZError } from '../../model/ZDocument';
import { BaseZGenerator } from '../BaseZGenerator';
import { ZEngineItem } from '../../core/ZEngine';

export class ErrorZGenerator extends BaseZGenerator<ZError> {

  parse(list: {[key: string]: ZError}): ZEngineItem[] {
    return [];
  }

}
