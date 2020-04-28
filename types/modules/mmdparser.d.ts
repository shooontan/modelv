declare module 'three/examples/jsm/libs/mmdparser.module.js' {
  export const MMDParser = {
    Parser,
  };

  export class Parser {
    parsePmx(data: FileReader['result'], leftToRight: boolean): object;
  }
}
