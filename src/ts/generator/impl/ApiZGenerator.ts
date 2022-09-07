import { ZApi } from '../../model/ZApi';
import { ZEngineItem } from '../../core/ZEngine';
import { BaseZGenerator } from '../BaseZGenerator';

export class ApiZGenerator extends BaseZGenerator<ZApi> {

  parse(list: {[key: string]: ZApi}): ZEngineItem[] {
    return [];
  }

}
