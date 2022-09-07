import fs from 'fs';
import yaml from 'js-yaml';
import { ZDocument } from '../model/ZDocument';
import { ZEngineRegistry } from './ZEngineRegistry';
import Handlebars from 'handlebars';
import { Util } from '../util/Util';
import { ErrorZGenerator } from '../generator/impl/ErrorZGenerator';
import { ModelZGenerator } from '../generator/impl/ModelZGenerator';
import { FunctionZGenerator } from '../generator/impl/FunctionZGenerator';
import { ApiZGenerator } from '../generator/impl/ApiZGenerator';

export class ZEngine {

  private readonly targetDir: string;
  private options: ZEngineOptions;
  private parsedItemList: ZEngineItem[] = [];

  static functions: {[key: string]: ((arg0: any) => any)} = {};

  private constructor(targetDir: string, options: ZEngineOptions) {
    this.targetDir = targetDir;
    this.options = options;
  }

  static run(sourcePath: string, targetDir: string, options?: ZEngineOptions) {
    console.log('A] Initializing...');
    try {
      let allOptions: ZEngineOptions = new DefaultEngineOptions();
      allOptions = { ...allOptions, ...options } as ZEngineOptions;

      const engine = new ZEngine(targetDir, allOptions);

      engine.injectFunctions(allOptions)
        .then(() => {
          engine.parse(sourcePath);
          console.log("   Waiting");
          setTimeout(() => {
            engine.compile();
            console.log(`Z] Exited.`);

          }, 200);

        });
    }
    catch (e: any) {
      console.log(`   Error : ${e.message}`);
    }
  }

  private injectFunctions(allOptions: ZEngineOptions): Promise<any> {
    console.log(` ] Adding functions.`);
    return new Promise((resolve, reject) => {
      let count = (allOptions?.functions||[]).length;
      const latch  = () => { if ( --count === 0) { resolve(true); } };

      allOptions.functions?.forEach(fn => {
        const path = Util.path(__dirname, fn.path).replace(/(.*)\.(js|ts)/gi, '$1');
        import(path)
          .then(m => {
            const instance = new m[fn.className]();
            Handlebars.registerHelper(fn.keyword, function (data: any) { return instance.apply(data); });
            ZEngine.functions[fn.keyword] = (arg) => instance.apply(arg);
          })
          .finally(() => { latch(); });
      });
    });
  }

  private parse(sourcePath: string) {
    console.log(' ] Parsing...');

    const source = fs.readFileSync(sourcePath).toString();
    const document = yaml.load(source) as ZDocument;

    let registry = new ZEngineRegistry();

    // 1 errors
    const errors = new ErrorZGenerator()
      .attach(document.setting, registry)
      .parse(document.components.exceptions) || [];

    this.parsedItemList.push(...errors);

    // 2 models
    const models = new ModelZGenerator()
      .attach(document.setting, registry)
      .parse(document.components.models) || [];

    this.parsedItemList.push(...models);

    // 3 functions
    const functions = new FunctionZGenerator()
      .attach(document.setting, registry)
      .parse(document.components.functions) || [];

    this.parsedItemList.push(...functions);

    // 4 dsl
    const api = new ApiZGenerator()
      .attach(document.setting, registry)
      .parse(document.components.api) || [];

    this.parsedItemList.push(...api);
    console.log('   Parsed.');
  }

  private compile() {
    console.log(' ] Compiling...');
    if (this.parsedItemList?.length === 0) {
      throw new ZEngineException('Nothing to compile');
    }


    const templates = this.options.templates;

    this.parsedItemList?.forEach(file => {
      let templatePath = this.findFirstTemplate(templates, file.componentType, file.type);
      templatePath = Util.path(__dirname, '../', templatePath);

      const tpl = fs.readFileSync(templatePath, 'utf8');
      const compile = Handlebars.compile(tpl)

      this.writeToDisk(file.fileDir, file.fileName, compile(file.data));
    });
    console.log('   Compiled.');
  }

  private findFirstTemplate(tpl: ZEngineTemplate[], componentType: string, type?: string): string {
    const founds: string[] = tpl
      .filter(value => value.component === componentType)
      .filter(value => {
        if (!type) { return true; }
        return (value.type || []).indexOf(type) > -1;
      })
      .map(value => value.path);

    if (founds.length === 0) throw new ZEngineException(`No template found for ${componentType}, ${type}`);
    return founds[0];
  }

  private writeToDisk(path: string, fileName: string, content: any) {
    const basePath = Util.path(this.targetDir, path);
    const filePath = Util.path(basePath, fileName + '.java');

    try {
      if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true, });
      }

      fs.writeFileSync(filePath, content);

    }
    catch (err) {
      console.error(err);
    }
  }
}

export class DefaultEngineOptions implements ZEngineOptions {
  templates: ZEngineTemplate[] = [
    { component: 'model', type: ['enum'], path: '../templates/model-enum.tpl' },
    {component: 'model', type: ['class', 'abstract'], path: '../templates/model-class.tpl'},
    { component: 'model', type: ['interface'], path: '../templates/model-interface.tpl' },
    {component: 'function', path: '../templates/function.tpl'},
    { component: 'api', path: 'templates/api.tpl' }, { component: 'error', path: '../templates/error.tpl' }];

  functions: ZEngineOptionsFunction[] = [{
    keyword: 'camelCase', className: 'CamelCaseFunction', path: '../functions/CamelCase.function.ts'
  }, { keyword: 'enumVal', className: 'EnumValFunction', path: '../functions/EnumVal.function.ts' }, {
    keyword: 'lower', className: 'LowerCaseFunction', path: '../functions/LowerCase.function.ts'
  }, { keyword: 'pascalCase', className: 'PascalCaseFunction', path: '../functions/PascalCase.function.ts' }, {
    keyword: 'upper', className: 'UpperCaseFunction', path: '../functions/UpperCase.function.ts'
  },];
}

export interface ZEngineOptions {
  templates: ZEngineTemplate[];
  functions: ZEngineOptionsFunction[];
}

export interface ZEngineOptionsFunction {
  keyword: string;
  className: string;
  path: string;
}

export interface ZEngineFunction<I, O> {
  apply: (data?: I) => O;
}

export class ZEngineException implements Error {
  message: string;
  name: string;
  stack: string;

  constructor(message: string) {
    this.message = message;
    this.name = 'codegen.EngineException';
    this.stack = '...';
  }
}

export interface ZEngineTemplate {
  component: 'model' | 'function' | 'api' | 'error';
  type?: string[];
  path: string;
}

export class ZEngineItem {
  fileDir!: string;
  fileName!: string;
  componentType!: 'model' | 'function' | 'api' | 'error';
  type?: string;
  data!: {[key: string]: any};
}
