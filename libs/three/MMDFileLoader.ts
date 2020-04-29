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

  istga(filename: string) {
    return /.tga$/.test(filename);
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
        // HACK: use TGALoader in MMDLoader
        const hash = this.istga(texture) ? '#ext=.tga' : '';
        return this.blobname(fileurl) + hash;
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

  // _loadTexture(
  //   filePath: string,
  //   textures: any,
  //   params: any,
  //   onProgress: any,
  //   onError: any
  // ) {
  //   params = params || {};

  //   var scope = this;

  //   let fullPath = '';

  //   if (params.isDefaultToonTexture === true) {
  //     let index = 0;

  //     try {
  //       // @ts-ignore
  //       index = parseInt(filePath.match(/toon([0-9]{2})\.bmp$/)[1]);
  //     } catch (e) {
  //       console.warn(
  //         'THREE.MMDLoader: ' +
  //           filePath +
  //           ' seems like a ' +
  //           'not right default texture path. Using toon00.bmp instead.'
  //       );
  //       // index = 0;
  //     }

  //     var DEFAULT_TOON_TEXTURES = [
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAN0lEQVRYR+3WQREAMBACsZ5/bWiiMvgEBTt5cW37hjsBBAgQIECAwFwgyfYPCCBAgAABAgTWAh8aBHZBl14e8wAAAABJRU5ErkJggg==',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOUlEQVRYR+3WMREAMAwDsYY/yoDI7MLwIiP40+RJklfcCCBAgAABAgTqArfb/QMCCBAgQIAAgbbAB3z/e0F3js2cAAAAAElFTkSuQmCC',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAN0lEQVRYR+3WQREAMBACsZ5/B5ilMvgEBTt5cW37hjsBBAgQIECAwFwgyfYPCCBAgAABAgTWAh81dWyx0gFwKAAAAABJRU5ErkJggg==',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOklEQVRYR+3WoREAMAwDsWb/UQtCy9wxTOQJ/oQ8SXKKGwEECBAgQIBAXeDt7f4BAQQIECBAgEBb4AOz8Hzx7WLY4wAAAABJRU5ErkJggg==',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPUlEQVRYR+1XwW7CMAy1+f9fZOMysSEOEweEOPRNdm3HbdOyIhAcklPrOs/PLy9RygBALxzcCDQFmgJNgaZAU6Ap0BR4PwX8gsRMVLssMRH5HcpzJEaWL7EVg9F1IHRlyqQohgVr4FGUlUcMJSjcUlDw0zvjeun70cLWmneoyf7NgBTQSniBTQQSuJAZsOnnaczjIMb5hCiuHKxokCrJfVnrctyZL0PkJAJe1HMil4nxeyi3Ypfn1kX51jpPvo/JeCNC4PhVdHdJw2XjBR8brF8PEIhNVn12AgP7uHsTBguBn53MUZCqv7Lp07Pn5k1Ro+uWmUNn7D+M57rtk7aG0Vo73xyF/fbFf0bPJjDXngnGocDTdFhygZjwUQrMNrDcmZlQT50VJ/g/UwNyHpu778+yW+/ksOz/BFo54P4AsUXMfRq7XWsAAAAASUVORK5CYII=',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMElEQVRYR+2Xv4pTQRTGf2dubhLdICiii2KnYKHVolhauKWPoGAnNr6BD6CvIVaihYuI2i1ia0BY0MZGRHQXjZj/mSPnnskfNWiWZUlzJ5k7M2cm833nO5Mziej2DWWJRUoCpQKlAntSQCqgw39/iUWAGmh37jrRnVsKlgpiqmkoGVABA7E57fvY+pJDdgKqF6HzFCSADkDq+F6AHABtQ+UMVE5D7zXod7fFNhTEckTbj5XQgHzNN+5tQvc5NG7C6BNkp6D3EmpXHDR+dQAjFLchW3VS9rlw3JBh+B7ys5Cf9z0GW1C/7P32AyBAOAz1q4jGliIH3YPuBnSfQX4OGreTIgEYQb/pBDtPnEQ4CivXYPAWBk13oHrB54yA9QuSn2H4AcKRpEILDt0BUzj+RLR1V5EqjD66NPRBVpLcQwjHoHYJOhsQv6U4mnzmrIXJCFr4LDwm/xBUoboG9XX4cc9VKdYoSA2yk5NQLJaKDUjTBoveG3Z2TElTxwjNK4M3LEZgUdDdruvcXzKBpStgp2NPiWi3ks9ZXxIoFVi+AvHLdc9TqtjL3/aYjpPlrzOcEnK62Szhimdd7xX232zFDTgtxezOu3WNMRLjiKgjtOhHVMd1loynVHvOgjuIIJMaELEqhJAV/RCSLbWTcfPFakFgFlALTRRvx+ok6Hlp/Q+v3fmx90bMyUzaEAhmM3KvHlXTL5DxnbGf/1M8RNNACLL5MNtPxP/mypJAqcDSFfgFhpYqWUzhTEAAAAAASUVORK5CYII=',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
  //     ];

  //     fullPath = DEFAULT_TOON_TEXTURES[index];
  //   } else {
  //     fullPath = this.resourcePath + filePath;
  //   }

  //   console.log(fullPath);

  //   if (textures[fullPath] !== undefined) return textures[fullPath];

  //   let loader = this.manager.getHandler(fullPath);

  //   if (loader === null) {
  //     // loader =
  //     //   filePath.slice(-4).toLowerCase() === '.tga'
  //     //     ? // @ts-ignore
  //     //       this._getTGALoader()
  //     //     : // @ts-ignore
  //     //       this.textureLoader;

  //     const isTGA = filePath.slice(-4).toLowerCase() === '.tga';
  //     // @ts-ignore
  //     loader = isTGA ? this._getTGALoader() : this.textureLoader;

  //     // console.log(filePath.slice(-4).toLowerCase() === '.tga');
  //     // console.log(loader);
  //   }

  //   // @ts-ignore
  //   var texture = loader?.load(
  //     fullPath,
  //     // @ts-ignore
  //     function (t) {
  //       // MMD toon texture is Axis-Y oriented
  //       // but Three.js gradient map is Axis-X oriented.
  //       // So here replaces the toon texture image with the rotated one.
  //       if (params.isToonTexture === true) {
  //         // @ts-ignore
  //         t.image = scope._getRotatedImage(t.image);

  //         t.magFilter = NearestFilter;
  //         t.minFilter = NearestFilter;
  //       }

  //       t.flipY = false;
  //       t.wrapS = RepeatWrapping;
  //       t.wrapT = RepeatWrapping;

  //       for (var i = 0; i < texture.readyCallbacks.length; i++) {
  //         texture.readyCallbacks[i](texture);
  //       }

  //       delete texture.readyCallbacks;
  //     },
  //     onProgress,
  //     onError
  //   );

  //   if (params.sphericalReflectionMapping === true) {
  //     texture.mapping = SphericalReflectionMapping;
  //   }

  //   texture.readyCallbacks = [];

  //   textures[fullPath] = texture;

  //   // console.log(fullPath)

  //   return texture;
  // }
}
