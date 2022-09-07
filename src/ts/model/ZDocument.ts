import { ZModel } from './ZModel';
import { ZFunction } from './ZFunction';
import { ZApi } from './ZApi';

export class ZDocument {
  setting: ZSetting = new ZSetting();
  components: ZComponents = new ZComponents();
}

export class ZSetting {
  namespace?: string;
  language!: "java8";
}

export class ZError {
  code!: number;
  reason!: string;
}

export class ZBind<T> {
  bind!: (name: string, nsp: string, obj: ZError|ZModel|ZFunction) => void;

  constructor(bind: (name: string, nsp: string, obj: ZError|ZModel|ZFunction) => void) {
    this.bind = bind;
  }
}

export class ZComponents {
  exceptions: {[key: string]: ZError} = {};
  api: {[key: string]: ZApi} = {};
  functions: {[key: string]: ZFunction} = {};
  models: {[key: string]: ZModel} = {};
}
