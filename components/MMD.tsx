import React from 'react';
import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
import { HeadPose } from '../context/HeadPose';

const CANVAS_SIZE = [640, 480] as const;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let effect: OutlineEffect;
let mesh: THREE.SkinnedMesh;
let helper: MMDAnimationHelper;

function initCanvas({ canvas }: { canvas?: HTMLCanvasElement }) {
  camera = new THREE.PerspectiveCamera(
    40,
    CANVAS_SIZE[0] / CANVAS_SIZE[1],
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
    canvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xcccccc, 0);

  effect = new OutlineEffect(renderer, {});
}

function loadModel() {
  helper = new MMDAnimationHelper();

  const modelFile = '/models/mmd/model/model.pmx';

  const loader = new MMDLoader();
  loader.load(
    // path to PMD/PMX file
    modelFile,
    // called when the resource is loaded
    (object) => {
      mesh = object;
      scene?.add(mesh);
    },
    // called when loading is in progresses
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    // called when loading has errors
    (error) => {
      console.log('An error happened');
      console.log(error);
    }
  );
}

function render() {
  requestAnimationFrame(render);
  effect.render(scene, camera);
}

export default () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [eulerAngles] = HeadPose.EulerAngles.useContainer();

  React.useEffect(() => {
    if (!eulerAngles) {
      return;
    }

    const x =
      ((180 - Math.abs(eulerAngles.pitch)) / 180) *
      (eulerAngles.pitch < 0 ? 1 : -1) *
      3;
    const y = eulerAngles.yaw / 180;
    const z = eulerAngles.roll / 180;

    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(x, y, z));

    const vpd = {
      bones: [
        {
          name: '頭',
          translation: [0, 0, 0],
          quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
        },
      ],
    };

    helper.pose(mesh, vpd);
  }, [eulerAngles]);

  React.useEffect(() => {
    initCanvas({
      canvas: canvasRef?.current || undefined,
    });
    loadModel();
    render();
    return () => {
      // camera = undefined;
      // scene = undefined;
      // renderer = undefined;
      // effect = undefined;
      // mesh = undefined;
      // helper = undefined;
    };
  }, []);

  return (
    <div>
      <p>
        yaw: {eulerAngles?.yaw}, pitch: {eulerAngles?.pitch}, roll:
        {eulerAngles?.roll}
      </p>
      <div ref={divRef}></div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};
