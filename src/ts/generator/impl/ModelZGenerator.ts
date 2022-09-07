import { ZModel } from '../../model/ZModel';
import { ZEngine, ZEngineItem } from '../../core/ZEngine';
import { BaseZGenerator } from '../BaseZGenerator';
import { Util } from '../../util/Util';
import { ZBind } from '../../model/ZDocument';

export class ModelZGenerator extends BaseZGenerator<ZModel> {

  parse(list: {[key: string]: ZModel}): ZEngineItem[] {
    return Object.entries(list).reduce((files, [name, model], i) => {

      const modelType = (model.type || 'class');

      let file: any = null;
      switch (modelType) {
        case 'class':
          const nsp = Util.namespace(this.setting.namespace || '', model.namespace || '');

          file = new ZEngineItem();
          file.fileName = ZEngine.functions['pascalCase'](name);
          file.fileDir = nsp.replace(/\./g, '/');
          file.componentType = 'model';
          file.type = 'class';
          file.data = new ModelData();
          file.data.imports = [];
          file.data.package = nsp;
          file.data.className = file.fileName;
          file.data.fields = Object.entries(model.properties).map(([pname, prop]) => {
            const pp = prop as any;
            const p = new ModelDataField();
            p.name = pname;
            p.default = (typeof pp.default === "string" && !pp.toString().startsWith("#")) ? `"${pp.default}"` : pp.default?.toString;
            p.type = (typeof pp === "string") ? pp : pp.type;
            if (p.type.startsWith('$')) {
              this.registry.needs(p.type.substring(1), new ZBind((name, bnsp, obj) => {
                p.type = name;
                if (file.data.imports.indexOf(bnsp) === -1) {
                  file.data.imports.push(bnsp);
                }
              }));
            }
            return p;
          });
          file.data.properties = 'final';
          file.data.comments = 'Test demo';

          this.registry.declare(
            '@' + Util.namespace(model.namespace || '', name),
            file.data.className,
            Util.namespace(nsp, name),
            model);
          break;

        case 'abstract':
          const adata = new ModelData();
          adata.properties = 'abstract';

          // files.push(adata);
          break;

        case 'enum':
          const nspEnum = Util.namespace(this.setting.namespace || '', model.namespace || '');

          file = new ZEngineItem();
          file.fileName = ZEngine.functions['pascalCase'](name);
          file.fileDir = nspEnum.replace(/\./g, '/');
          file.componentType = 'model';
          file.type = 'enum';
          file.data = new EnumData();
          file.data.package = nspEnum;
          file.data.className = file.fileName;
          file.data.values = file.values;
          file.data.comments = 'Test DEMO';
          break;
      }

      if (!!file) { files.push(file as ZEngineItem); }
      return files;
    }, [] as ZEngineItem[]);
  }
}

export class ModelData {
  package!: string;
  imports: string[] = [];
  className!: string;
  properties?: string;
  fields: ModelDataField[] = [];
  comments?: string;
}

export class ModelDataField {
  name!: string;
  type!: string;
  properties?: string;
  options?: string;
  default?: string;
  comments?: string;
}

export class EnumData {
  package!: string;
  className!: string;
  values: string[] = [];
  comments?: string;
}
