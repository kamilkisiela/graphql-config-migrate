import { Parser } from './parser';

export const JSONParser: Parser = {
  name: 'json',
  parse(code) {
    return JSON.parse(code);
  },
  stringify(obj) {
    return JSON.stringify(obj, null, 2);
  }
};
