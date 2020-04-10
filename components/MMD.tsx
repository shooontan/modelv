import React from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
import { GUI } from 'dat.gui';

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 560;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let effect: OutlineEffect;
let mesh: THREE.SkinnedMesh;
let helper: MMDAnimationHelper;

export default () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const Init = React.useCallback(() => {
    camera = new THREE.PerspectiveCamera(
      40,
      CANVAS_WIDTH / CANVAS_HEIGHT,
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
    renderer.setClearColor(0xcccccc, 0);

    effect = new OutlineEffect(renderer, {});
  }, []);

  const LoadModel = React.useCallback(() => {
    helper = new MMDAnimationHelper();

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

    // @ts-ignore
    const initGui = () => {
      const gui = new GUI();
      const dictionary = mesh.morphTargetDictionary;

      var controls: { [key: string]: number } = {};
      var keys: string[] = [];

      const mcontrols: { [key: string]: number } = {};
      const mkeys = {
        'head-trans-x': {},
        'head-trans-y': {},
        'head-trans-z': {},
        'head-quat-x': {},
        'head-quat-y': {},
        'head-quat-z': {},
        'head-quat-w': {},
        'head-rotate-x': {
          min: -90,
          max: 90,
          step: 1,
        },
        'head-rotate-y': {
          min: -90,
          max: 90,
          step: 1,
        },
        'head-rotate-z': {
          min: -90,
          max: 90,
          step: 1,
        },
      };

      var morphs = gui.addFolder('Morphs');
      var motion = gui.addFolder('Motion');

      function initControls() {
        for (var key in dictionary) {
          controls[key] = 0.0;
        }

        for (var key in mkeys) {
          mcontrols[key] = 0.0;
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

      function initMotion() {
        for (var key in mkeys) {
          // @ts-ignore
          const min: number = mkeys[key]?.min || -1;
          // @ts-ignore
          const max: number = mkeys[key]?.max || 1;
          // @ts-ignore
          const step: number = mkeys[key]?.step || 0.01;
          motion.add(mcontrols, key, min, max, 0.01).onChange(onChangePose);
        }
      }

      function onChangeMorph() {
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = controls[key];
          mesh.morphTargetInfluences && (mesh.morphTargetInfluences[i] = value);
        }
      }

      function onChangePose() {
        const x = mcontrols['head-rotate-x'] / 180;
        const y = mcontrols['head-rotate-y'] / 180;
        const z = mcontrols['head-rotate-z'] / 180;

        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(x, y, z));

        const vpd = {
          bones: [
            {
              name: '頭',
              translation: [
                mcontrols['head-trans-x'],
                mcontrols['head-trans-y'],
                mcontrols['head-trans-z'],
              ],
              quaternion: [
                quaternion.x,
                quaternion.y,
                quaternion.z,
                quaternion.w,
              ],
            },
          ],
        };

        helper.pose(mesh, vpd);
      }

      initControls();
      initKeys();
      initMorphs();
      initMotion();

      onChangeMorph();
      onChangePose();

      // morphs.open();
      motion.open();
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
      <canvas ref={canvasRef} width="720" height="560"></canvas>
    </div>
  );
};
