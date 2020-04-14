import jsYaml from "js-yaml";
import { Parser } from "./parser";

export const YAMLParser: Parser = {
  name: 'yaml',
  parse(code) {
    return jsYaml.load(code);
  },
  stringify(obj) {
    return jsYaml.dump(obj, {
      indent: 2,
    });
  },
};
