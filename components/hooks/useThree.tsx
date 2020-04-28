import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
import { MMDFileLoader } from '@/libs/three/MMDFileLoader';

type Config = {
  canvas: React.RefObject<HTMLCanvasElement>;
  camera: {
    fov?: number | undefined;
    aspect?: number | undefined;
    near?: number | undefined;
    far?: number | undefined;

    x: number;
    y: number;
    z: number;
  };
};

export const useMMD = (config: Config) => {
  const [ucamera, setUCamera] = useState<THREE.PerspectiveCamera>();
  const [uhelper, setUHelper] = useState<MMDAnimationHelper>();
  const [uscene, setUScene] = useState<THREE.Scene>();
  const [ueffect, setUEffect] = useState<OutlineEffect>();
  const [umesh, setUMesh] = useState<THREE.SkinnedMesh>();

  useEffect(
    () => {
      const camera = new THREE.PerspectiveCamera(
        config.camera.fov,
        config.camera.aspect,
        config.camera.near,
        config.camera.far
      );
      camera.position.set(config.camera.x, config.camera.y, config.camera.z);
      setUCamera(camera);

      // scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // ambient
      const ambient = new THREE.AmbientLight(0xeeeeee);
      scene.add(ambient);
      setUScene(scene);

      // renderer
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: config.canvas.current || undefined,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xcccccc, 0);

      // effect
      const effect = new OutlineEffect(renderer, {});
      setUEffect(effect);

      // helper
      const helper = new MMDAnimationHelper();
      setUHelper(helper);

      return () => {
        // TODO: release
        if (umesh) {
          scene.remove(umesh);
          if (Array.isArray(umesh.material)) {
            const len = umesh.material.length;
            for (let i = 0; i < len; i++) {
              umesh.material[i].dispose();
            }
          } else {
            umesh.material.dispose();
          }
          umesh.geometry.dispose();
        }
        scene.dispose();
        renderer.renderLists.dispose();
      };
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  const loader = useCallback(
    (files: FileList) => {
      const loader = new MMDFileLoader({
        locationOrigin: window.location.origin,
      });
      loader.loadFile(files, (object) => {
        const mesh = object;
        uscene?.add(mesh);
        setUMesh(mesh);
      });
    },
    [uscene]
  );

  return {
    camera: ucamera,
    helper: uhelper,
    scene: uscene,
    effect: ueffect,
    mesh: umesh,
    mmdFileload: loader,
  };
};
