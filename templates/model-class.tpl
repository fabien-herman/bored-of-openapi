package {{package}};

{{#imports}}
import {{this}};
{{/imports}}

/** {{comments}} */
public {{properties}} class {{className}} {
    {{#fields}}
    /* {{comments}} */
    public {{properties}} {{{type}}} {{name}}{{#default}} = {{{this}}}{{/default}};
    {{/fields}}

    public {{className}}() { /**/ }

    {{#fields}}
    public {{{type}}} get{{pascalCase name}}() { return this.{{name}}; }
    {{/fields}}

    {{#fields}}
    public void set{{pascalCase name}}({{{type}}} {{name}}) { this.{{name}} = {{name}}; }
    {{/fields}}

    public static {{className}}Builder builder() { return new {{className}}Builder(); }

    public static class {{className}}Builder {
        private {{className}} instance;

        protected {{className}}Builder() { this.instance = new {{className}}(); }
        public {{className}} build() { return instance; }

        {{#fields}}
        public {{../className}}Builder {{name}}({{{type}}} {{name}}) { instance.{{name}} = {{name}}; return this; }
        {{/fields}}
    }
}
