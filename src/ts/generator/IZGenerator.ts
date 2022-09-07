import { ZEngineRegistry } from '../core/ZEngineRegistry';
import { ZSetting } from '../model/ZDocument';

export  interface IZGenerator<T> {

  attach(setting: ZSetting, registry: ZEngineRegistry): IZGenerator<T>;

  parse(list: {[key: string]: T}): void;

}
