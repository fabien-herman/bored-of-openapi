import { ExplodedClass } from './ExplodedClass';

export class Util {

  private static REG_NSP = /([0-9A-Za-z_\$\.]+)\.([0-9A-Za-z_\$]+)(|<(.+)>)$/g;

  private static PATH_DOT = /^\.(\/|\\\\)(.*)$/g;
  private static PATH_2DOT = /^\.\.(\/|\\\\)(.*)$/g;
  private static PATH_SEP = /.*(\/|\\\\).*/;

  private static IS_ABSOLUTE = /^([a-z]:\\|[a-z]:\/|\/\/|\/)(.*)$/gi;
  private static IS_FILE = /.*(\\\\|\\|\/)(\w+\.[0-9a-z]{2,16})/gi;
  private static WIN_SEPARATOR = /^([a-zA-Z]:\/\/|\/\/|\/).*$/;

  static namespaceToPath(namespace: string): string {
    return namespace.replace(/\./g, '/').replace('//', '/');
  }

  static quote(value: string, prefix: string, suffix: string): string {
    return (value !== undefined) ? ((prefix || '') + value.trim() + (suffix || '')) : '';
  }

  static capitalize(text: string): string {
    return text?.substring(0, 1).toUpperCase() + text?.substring(1);
  }

  static namespace(...namespaces: string[]): string {
    const nsp = namespaces.reduce((arr, path) => {
      arr.push(...path.split(/\./g));
      return arr;
    }, [] as string[])

    return nsp.filter(s => s !== "").join(".")
  }

  static path(...paths: string[]): string {
    const result: string[] = [];
    paths.forEach((v,i) => {
      const vv = v.replace(/(\\|\\\\)/g, '/');
      if (v.match(Util.IS_ABSOLUTE)) {
        result.splice(0, result.length);
        result.push(...vv.split(/\//g).filter(v => v !== ''));
      }
      else if (v.match(Util.PATH_2DOT) && i > 0) {
        const arrrr = vv.split(/\//g).filter(v => v !== '')
        let nBack = (v.match(/(\.\.\/)/g) || []).length;
        if (nBack > 0) {
          result.splice(result.length - nBack, nBack);
          arrrr.splice(0, nBack);
        }
        result.push(...arrrr);
      } else {
        result.push(...vv.split(/\//g).filter(v => v !== ''));
      }
    });
    return result.reduce((p,c, i) => (i === 0) ? c : `${p}/${c}`, '');
  }

  // static boom(className: string, rootNamespace: string): ExplodedClass {
  //   const name = className?.trim();
  //
  //   if (name?.indexOf('$') === 0) {
  //     const refName = name.substring(1, name.length);
  //     const refModel = CodegenDiy.getModel(refName);
  //     return CodegenDiy.boom(baseNsp + CodegenDiy.quote(refModel.namespace, '.') + '.' + refName, baseNsp);
  //   } else if (name.indexOf('.') > -1) {
  //     const g = name?.split(CodegenDiy.REG_NSP);
  //     const sub = g[3]?.replace(/[<> ]/g, '')?.split(',')?.reduce((p, c) => {
  //       if (c.trim().length > 0) {
  //         p.push(CodegenDiy.boom(c, baseNsp));
  //       }
  //       return p;
  //     }, []) || [];
  //     return { full: name, path: g[1], name: g[2], short: g[2] + g[3], sub: sub };
  //   } else {
  //     return { full: name, path: undefined, name: name, short: name, sub: undefined };
  //   }
  // }
}
