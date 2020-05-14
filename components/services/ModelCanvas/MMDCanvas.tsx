import React from 'react';
import { useMMD } from '@/components/hooks/useThree';
import { Input } from '@/components/atoms/Input';
import { MMDCanvasConnectPose } from './MMDCanvasConnectPose';

const CANVAS_SIZE = [640, 480] as const;

const RENDER_THROTTLE = 1;

export const MMDCanvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const connectionRef = React.useRef<
    React.ElementRef<typeof MMDCanvasConnectPose>
  >(null);
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

  const animation = (renderThrottleCount: number) => {
    if (effect && scene && camera) {
      const nextRenderCount = (renderThrottleCount + 1) % RENDER_THROTTLE;
      requestAnimationFrame(() => animation(nextRenderCount));
      if (renderThrottleCount === 0) {
        // update model pose
        connectionRef.current?.setPose();
        // render model
        effect.render(scene, camera);
      }
    }
  };

  return (
    <>
      <div>
        <canvas ref={canvasRef} width={size[0]} height={size[1]} />
      </div>
      <MMDCanvasConnectPose
        ref={connectionRef}
        helper={helper}
        scene={scene}
        mesh={mesh}
      />

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
                animation(0);
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

export default MMDCanvas;
