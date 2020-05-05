import React from 'react';
import * as THREE from 'three';
import { HeadPose } from '@/context/HeadPose';
import { Landmark } from '@/context/Landmark';
import { KalmanFilter } from '@/libs/KalmanFilter';
import { useMMD } from '@/components/hooks/useThree';
import { Input } from '@/components/atoms/Input';

const CANVAS_SIZE = [640, 480] as const;

const kfilter = new KalmanFilter({
  d: 3,
  R: 0.01,
  Q: 3,
});

export const MMD = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [eulerAngles] = HeadPose.EulerAngles.useContainer();
  const [points] = Landmark.Points.useContainer();

  const [size, setSize] = React.useState<[number, number]>([
    CANVAS_SIZE[0],
    CANVAS_SIZE[1],
  ]);

  const [modelLoaded, setModelLoaded] = React.useState<boolean>(false);

  const { camera, renderer, scene, effect, helper, mesh, mmdFileload } = useMMD(
    {
      canvas: canvasRef,
      camera: {
        fov: 40,
        aspect: size[0] / size[1],
        near: 1,
        far: 1000,
        x: 0,
        y: 18,
        z: 10,
      },
    }
  );

  React.useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (renderer) {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
      }
      if (camera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      setSize([width, height]);
    }
    resize();
    addEventListener('resize', resize);
    return () => {
      removeEventListener('resize', resize);
    };
  }, [renderer, camera]);

  React.useEffect(
    () => {
      if (!eulerAngles || !mesh || !helper) {
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
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [eulerAngles, points]
  );

  const animation = React.useCallback(() => {
    if (effect && scene && camera) {
      requestAnimationFrame(animation);
      effect.render(scene, camera);
    }
  }, [effect, scene, camera]);

  return (
    <>
      <div>
        <canvas ref={canvasRef} width={size[0]} height={size[1]} />
      </div>
      {!modelLoaded && (
        <form>
          <p>
            <span>ファイルを選択</span>
          </p>
          <Input.File
            multiple
            onChange={(e) => {
              const files = e.target?.files;
              if (files) {
                setModelLoaded(true);
                mmdFileload(files);
                animation();
              }
            }}
          />
        </form>
      )}
      <style jsx>{`
        div {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        form {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: 100%;
          width: 100%;
          height: 100%;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        p {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 300px;
          height: 200px;
          background: #f3f3f3;
          border: 1px solid #fafafa;
          border-radius: 6px;
        }

        p:hover {
          background: #f3f3f3;
        }

        form :global(input) {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: 100%;
          max-width: 300px;
          height: 200px;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default MMD;
