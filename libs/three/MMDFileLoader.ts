import * as THREE from 'three';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDParser, Parser } from 'three/examples/jsm/libs/mmdparser.module.js';

export class MMDFileLoader extends MMDLoader {
  locationOrigin: string;
  parser: Parser | null = null;

  constructor(config: { locationOrigin: string }) {
    super();
    this.locationOrigin = config.locationOrigin || '';
  }

  loadFile(files: FileList, onLoad: (mesh: THREE.SkinnedMesh) => void) {
    let mmdFile: File | undefined;
    let resourceFiles: {
      [filename: string]: File;
    } = {};

    // @ts-ignore
    const builder = this.meshBuilder.setCrossOrigin('anonymous');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = this.extname(file.name);
      if (ext === 'pmd' || ext === 'pmx') {
        mmdFile = file;
      } else {
        resourceFiles[file.name] = file;
      }
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const parser = this.getParser();
      let data = parser.parsePmx(fileReader.result, true);
      data = this.replaceResourcePath(data, resourceFiles);
      onLoad(builder.build(data, `blob:${this.locationOrigin}/`));
    };
    if (mmdFile instanceof File) {
      fileReader.readAsArrayBuffer(mmdFile);
    }
  }

  extname(filename: string) {
    const index = filename.lastIndexOf('.');
    return index < 0 ? '' : filename.slice(index + 1);
  }

  blobname(url: string) {
    const parsed = new URL(url.replace('blob:', ''));
    return parsed.pathname.replace('/', '');
  }

  replaceResourcePath(
    data: any,
    resourceFiles: {
      [filename: string]: File;
    } = {}
  ) {
    data.textures = ((data.textures as string[]) || []).map((texture) => {
      if (resourceFiles[texture] instanceof File) {
        const fileurl = URL.createObjectURL(resourceFiles[texture]);
        return this.blobname(fileurl);
      }
      return texture;
    });
    return data;
  }

  getParser() {
    if (this.parser === null) {
      this.parser = new MMDParser.Parser();
    }
    return this.parser;
  }
}
