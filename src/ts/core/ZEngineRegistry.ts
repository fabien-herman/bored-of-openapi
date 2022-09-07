import { ZModel } from '../model/ZModel';
import { ZError, ZBind } from '../model/ZDocument';
import { ZFunction } from '../model/ZFunction';

export class ZEngineRegistry {

  private _registry: {[key: string]: {name: string, nsp: string, obj: ZError|ZModel|ZFunction}} = {};

  private _needs: {[key: string]: ZBind<any>[]} = {};

  declare(key: string, name: string, nsp: string, obj: ZError|ZModel|ZFunction) {
    this._registry[key] = {name, nsp, obj};
    if (this._needs[key]) {
      this._needs[key].forEach(ref => { ref.bind(name, nsp, obj); });
      this._needs[key] = [];
    }
  }

  needs(key: string, ref: ZBind<any>) {
    if (!!this._registry[key]) {
      const b = this._registry[key]
      ref.bind(b.name, b.nsp, b.obj);
      return;
    }
    else if (!this._needs[key]) {
      this._needs[key] = [];
    }
    this._needs[key].push(ref)
  }

  hasUnresolved(): number { return Object.keys(this._needs).length; }
}
