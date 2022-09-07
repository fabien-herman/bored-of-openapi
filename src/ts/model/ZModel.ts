import { ZBind } from './ZDocument';

export class ZModel {
  type: 'class'|'abstract'|'interface'|'enum' = "class";
  namespace?: string;
  parent?: ZBind<ZModel>;
  methods: {[key: string]: Method} = {};
  properties: {[key: string]: string|Property|undefined} = {};
}
export class Property {
  type!: any;
  readonly?: boolean = false;
  nullable?: boolean = true;
  default?: string;
  static?: boolean = false;
  parent?: string;
  visibility?: 'open'|'close' = 'open'
}
export class Method {
  name!: string;
  returnType!: ZBind<any|void>;
  arguments: {[key: string]: MethodArg} = {};
  errors: ZBind<Error>[] = [];
  static?: boolean = false;
  visibility?: 'open'|'close' = 'open';
}
export class MethodArg {
  type!: string|ZBind<any>|void;
  nullable?: boolean
  default?: string;
}
