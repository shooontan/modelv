import React from 'react';
import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
import { HeadPose } from '../context/HeadPose';
import { Landmark } from '../context/Landmark';
import { KalmanFilter } from '../libs/KalmanFilter';

const CANVAS_SIZE = [640, 480] as const;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let effect: OutlineEffect;
let mesh: THREE.SkinnedMesh;
let helper: MMDAnimationHelper;

const kfilter = new KalmanFilter({
  d: 3,
  R: 0.01,
  Q: 3,
});

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
  const [points] = Landmark.Points.useContainer();

  React.useEffect(() => {
    if (!eulerAngles || !mesh) {
      return;
    }

    const x =
      ((180 - Math.abs(eulerAngles.pitch)) / 180) *
      -Math.sign(eulerAngles.pitch) *
      4;
    const y = eulerAngles.yaw / 90;
    const z = eulerAngles.roll / 90;

    const quaternionHead = new THREE.Quaternion();
    quaternionHead.setFromEuler(new THREE.Euler(x / 2, y / 2, z / 2, 'XYZ'));

    const bodyEuler = kfilter.filter([x, y, z]);
    const quaternionBody = new THREE.Quaternion();
    quaternionBody.setFromEuler(
      new THREE.Euler(
        bodyEuler[0] / 2,
        bodyEuler[1] / 2,
        bodyEuler[2] / 2,
        'XYZ'
      )
    );

    const vpd = {
      bones: [
        {
          name: '頭',
          translation: [0, 0, 0],
          quaternion: [
            quaternionHead.x,
            quaternionHead.y,
            quaternionHead.z,
            quaternionHead.w,
          ],
        },
        {
          name: '上半身',
          translation: [0, 0, 0],
          quaternion: [
            quaternionBody.x,
            quaternionBody.y,
            quaternionBody.z,
            quaternionBody.w,
          ],
        },
      ],
    };

    // morph
    const { upperLip, lowerLip, leftMouth, rightMouth } = points;
    if (upperLip && lowerLip && leftMouth && rightMouth) {
      const dicAIndex = mesh.morphTargetDictionary?.['あ'];
      if (typeof dicAIndex === 'number' && mesh.morphTargetInfluences) {
        const disth = Math.sqrt(
          (leftMouth[0] - rightMouth[0]) ** 2 +
            (leftMouth[1] - rightMouth[1]) ** 2
        );
        const distv = Math.sqrt(
          (upperLip[0] - lowerLip[0]) ** 2 + (upperLip[1] - lowerLip[1]) ** 2
        );
        // あ
        mesh.morphTargetInfluences[dicAIndex] = Math.min(distv / disth, 1);
      }
    }

    helper.pose(mesh, vpd);
  }, [eulerAngles, points]);

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
        {eulerAngles && (
          <>
            <span style={{ color: 'green' }}>　yaw: </span>
            {Math.round(eulerAngles.yaw)}
          </>
        )}
        {eulerAngles && (
          <>
            <span style={{ color: 'blue' }}>　pitch: </span>
            {Math.round(eulerAngles.pitch)}
          </>
        )}
        {eulerAngles && (
          <>
            <span style={{ color: 'red' }}>　roll: </span>
            {Math.round(eulerAngles.roll)}
          </>
        )}
      </p>
      <div ref={divRef}></div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};
