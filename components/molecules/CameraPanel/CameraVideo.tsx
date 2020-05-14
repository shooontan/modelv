import React from 'react';
import { useDispatch } from 'react-redux';
import * as faceapi from 'face-api.js';
import { AppDispatch } from '@/store';
import { landmark } from '@/modules';
import { useFaceDetect } from '@/components/hooks/useFaceDetect';
import { CameraHeadposeAngle } from './CameraHeadposeAngle';
import { KalmanFilter } from '@/libs/KalmanFilter';

type LandmarkName =
  | 'nose'
  | 'leftEye'
  | 'rightEye'
  | 'jaw'
  | 'leftMouth'
  | 'rightMouth'
  | 'upperLip'
  | 'lowerLip'
  | 'leftOutline'
  | 'rightOutline';

const kfilter = {
  nose: new KalmanFilter(),
  leftEye: new KalmanFilter(),
  rightEye: new KalmanFilter(),
  jaw: new KalmanFilter(),
  leftMouth: new KalmanFilter(),
  rightMouth: new KalmanFilter(),
  upperLip: new KalmanFilter(),
  lowerLip: new KalmanFilter(),
  leftOutline: new KalmanFilter(),
  rightOutline: new KalmanFilter(),
};

function formatPoint(
  name: LandmarkName,
  point?: faceapi.Point
): [number, number] | undefined {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    return undefined;
  }
  const [x, y] = kfilter[name].filter([point.x, point.y]);
  return [x, y];
}

type CameraVideoProps = {
  active: boolean;
};

export const CameraVideo: React.FC<CameraVideoProps> = (props) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasAngleRef = React.useRef<HTMLCanvasElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const {
    points,
    videoDomSize,
    isLandscapeVideoStream,
    renderCount,
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
      dispatch(
        landmark.actions.updatePoints({
          nose: formatPoint('nose', points.nose),
          leftEye: formatPoint('leftEye', points.leftEye),
          rightEye: formatPoint('rightEye', points.rightEye),
          jaw: formatPoint('jaw', points.jaw),
          leftMouth: formatPoint('leftMouth', points.leftMouth),
          rightMouth: formatPoint('rightMouth', points.rightMouth),
          upperLip: formatPoint('upperLip', points.upperLip),
          lowerLip: formatPoint('lowerLip', points.lowerLip),
          leftOutline: formatPoint('leftOutline', points.leftOutline),
          rightOutline: formatPoint('rightOutline', points.rightOutline),
        })
      );
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [points, renderCount]
  );

  React.useEffect(
    () => {
      if (props.active) {
        createStream().then(() => detect(0));
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
          <CameraHeadposeAngle canvasRef={canvasAngleRef}>
            <canvas
              ref={canvasAngleRef}
              width={videoDomSize.width}
              height={videoDomSize.height}
            />
          </CameraHeadposeAngle>
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
