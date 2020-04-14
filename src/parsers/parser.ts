export interface Parser {
  name: string;
  parse(code: string): object;
  stringify(obj: object): string;
}
