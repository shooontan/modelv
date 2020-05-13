import React from 'react';
import { Landmark } from '@/context';
import { useFaceDetect } from '@/components/hooks/useFaceDetect';

type CameraVideoProps = {
  active: boolean;
};

export const CameraVideo: React.FC<CameraVideoProps> = (props) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [, setPoints] = Landmark.Points.useContainer();

  const {
    points,
    videoDomSize,
    isLandscapeVideoStream,
    createStream,
    detect,
    stopDetect,
  } = useFaceDetect({
    active: props.active,
    videoRef,
    canvasRef,
    videoSize: {
      width: 640,
      height: 480,
    },
  });

  React.useEffect(
    () => {
      setPoints(points);
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [points]
  );

  React.useEffect(
    () => {
      if (props.active) {
        createStream().then(() => detect());
      } else {
        videoRef.current && stopDetect(videoRef.current);
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [props.active]
  );

  return (
    <>
      <div className="videoframe">
        <div className="inner">
          <video ref={videoRef} autoPlay muted playsInline />
          <canvas
            ref={canvasRef}
            width={videoDomSize.width}
            height={videoDomSize.height}
          />
          <canvas
            id="canvas2"
            width={videoDomSize.width}
            height={videoDomSize.height}
          />
        </div>
      </div>

      <style jsx>{`
        .videoframe {
          margin: 0 0 20px;
          background: #111;
        }

        .videoframe .inner {
          display: flex;
          position: relative;
          margin: 0 auto;
          width: 100%;
          max-width: 640px;
          height: 480px;
          background: #000;
        }

        video {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: 100%;
          height: ${isLandscapeVideoStream ? 'auto' : '100%'};
          transform: scaleX(-1);
        }

        canvas {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          transform: scaleX(-1);
        }
      `}</style>
    </>
  );
};
