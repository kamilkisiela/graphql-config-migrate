import { produce } from "immer";
import { YAMLParser } from "./parsers/yaml";
import { JSONParser } from "./parsers/json";

export function migrate(code: string, filepath: string) {
  const isJSON = /^\s*\{/.test(code) || extension(filepath.toLowerCase()) === 'json';
  const parser = isJSON ? JSONParser : YAMLParser;
  const config: any = parser.parse(code);

  const migrateProject = pipe(
    migrateSchemaPath,
    migrateIncludes,
    migrateExcludes
  );

  const migrations = [migrateProject];

  if (config.projects) {
    for (const name in config.projects) {
      if (config.projects.hasOwnProperty(name)) {
        migrations.push((config) => migrateProject(config.projects[name]));
      }
    }
  }

  return parser.stringify(produce(config, pipe(...migrations)));
}

function extension(filepath: string) {
  const parts = filepath.toLowerCase().split(".");
  const ext = parts[parts.length - 1];

  return ext === "json" ? ext : "yaml";
}

function pipe(...fns: Array<<T extends any>(config: T) => void>) {
  return (config: any) => {
    fns.forEach((fn) => {
      fn(config);
    });
  };
}

function migrateSchemaPath(config: any) {
  if (config.schemaPath) {
    config.schema = config.schemaPath;
    delete config.schemaPath;
  }
}

function migrateIncludes(config: any) {
  if (config.includes) {
    config.include = config.includes;
    delete config.includes;
  }
}

function migrateExcludes(config: any) {
  if (config.excludes) {
    config.exclude = config.excludes;
    delete config.excludes;
  }
}
