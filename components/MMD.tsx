import React from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { GUI } from 'dat.gui';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let effect: OutlineEffect;
let mesh: THREE.SkinnedMesh;

export default () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const Init = React.useCallback(() => {
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 18, 10);

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const ambient = new THREE.AmbientLight(0xeeeeee);
    scene.add(ambient);

    //
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvasRef?.current || undefined,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xcccccc, 0);

    effect = new OutlineEffect(renderer, {});
  }, []);

  const LoadModel = React.useCallback(() => {
    const modelFile = '/models/mmd/model/model.pmx';

    const loader = new MMDLoader();
    loader.load(
      // path to PMD/PMX file
      modelFile,
      // called when the resource is loaded
      function (object) {
        mesh = object;

        scene?.add(mesh);

        initGui();
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
        console.log(error);
      }
    );

    const initGui = () => {
      const gui = new GUI();
      const dictionary = mesh.morphTargetDictionary;

      var controls: { [key: string]: number } = {};
      var keys: string[] = [];

      var morphs = gui.addFolder('Morphs');

      function initControls() {
        for (var key in dictionary) {
          controls[key] = 0.0;
        }
      }

      function initKeys() {
        for (var key in dictionary) {
          keys.push(key);
        }
      }

      function initMorphs() {
        for (var key in dictionary) {
          morphs.add(controls, key, 0.0, 1.0, 0.01).onChange(onChangeMorph);
        }
      }

      function onChangeMorph() {
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = controls[key];
          mesh.morphTargetInfluences && (mesh.morphTargetInfluences[i] = value);
        }
      }

      initControls();
      initKeys();
      initMorphs();

      onChangeMorph();

      morphs.open();
    };
  }, []);

  const Render = React.useCallback(() => {
    requestAnimationFrame(Render);

    effect.render(scene, camera);
  }, []);

  React.useEffect(() => {
    Init();
    LoadModel();
    Render();

    return () => {};
  }, []);

  console.log(scene);

  return (
    <div>
      <Link href="/">
        <a>top</a>
      </Link>
      <div ref={divRef}></div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
