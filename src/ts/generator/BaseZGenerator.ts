import { ZEngineRegistry } from '../core/ZEngineRegistry';
import { IZGenerator } from './IZGenerator';
import { ZEngineItem } from '../core/ZEngine';
import { ZSetting } from '../model/ZDocument';

export abstract class BaseZGenerator<T> implements IZGenerator<T>{

  protected setting!: ZSetting
  protected registry!: ZEngineRegistry

  attach(setting: ZSetting, registry: ZEngineRegistry) {
    this.setting = setting;
    this.registry = registry;
    return this;
  }

  abstract parse(list: {[key: string]: T}): ZEngineItem[];
}
