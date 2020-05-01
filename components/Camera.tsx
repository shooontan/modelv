import React from 'react';
// import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import { Landmark } from '@/context/Landmark';
import { KalmanFilter } from '@/libs/KalmanFilter';
import { mediaStreamErrorType } from '@/libs/media/error';

const CANVAS_SIZE = [640, 480] as const;

type CameraStatus = 'active' | 'inactive' | 'blocked';

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

export const Camera = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [cameraStatus, setCameraStatus] = React.useState<CameraStatus>(
    'inactive'
  );
  const [isLoadedModel, setIsLoadedModel] = React.useState<boolean>(false);
  const [, setPoints] = Landmark.Points.useContainer();

  /**
   * load face-api.js models
   */
  React.useEffect(() => {
    let unmount = false;

    loadNets();
    async function loadNets() {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('models/weights'),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/weights'),
        ]);

        // model loading is complate
        !unmount && setIsLoadedModel(true);
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      unmount = true;
    };
  }, []);

  /**
   * stop camera stream track
   */
  React.useEffect(() => {
    return () => {
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      const video = videoRef.current;
      const stream = video?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      } else {
        /**
         * TODO: fix
         * When user go back page soon, can not stop track because stream is not started and 'null'.
         * To deal with this problem, use settimeout.
         */
        setTimeout(() => {
          const stream = video?.srcObject;
          if (stream instanceof MediaStream) {
            stream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        }, 1000);
      }
    };
  }, []);

  /**
   * face detect
   */
  React.useEffect(() => {
    if (cameraStatus !== 'active' || !isLoadedModel) {
      return;
    }

    let unmount = false;

    detect();
    async function detect() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return console.log('video or canvas is null');
      }

      !unmount && cameraStatus === 'active' && requestAnimationFrame(detect);

      //  get facedata from webcam
      const useTinyModel = true;
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
          })
        )
        .withFaceLandmarks(useTinyModel);

      if (!detection) {
        return;
      }

      // resize facedata
      const resizedDetection = faceapi.resizeResults(detection, {
        width: video.width,
        height: video.height,
      });

      // draw canvas landmarks point
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

      // update points
      const landmarks = resizedDetection.landmarks;
      const nose = landmarks.getNose()[3];
      const leftEye = landmarks.getLeftEye()[0];
      const rightEye = landmarks.getRightEye()[3];
      const jaw = landmarks.getJawOutline()[8];
      const leftMouth = landmarks.getMouth()[0];
      const rightMouth = landmarks.getMouth()[6];
      const upperLip = landmarks.getMouth()[14];
      const lowerLip = landmarks.getMouth()[18];
      const leftOutline = landmarks.getJawOutline()[0];
      const rightOutline = landmarks.getJawOutline()[16];

      !unmount &&
        setPoints({
          nose: formatPoint('nose', nose),
          leftEye: formatPoint('leftEye', leftEye),
          rightEye: formatPoint('rightEye', rightEye),
          jaw: formatPoint('jaw', jaw),
          leftMouth: formatPoint('leftMouth', leftMouth),
          rightMouth: formatPoint('rightMouth', rightMouth),
          upperLip: formatPoint('upperLip', upperLip),
          lowerLip: formatPoint('lowerLip', lowerLip),
          leftOutline: formatPoint('leftOutline', leftOutline),
          rightOutline: formatPoint('rightOutline', rightOutline),
        });
    }

    return () => {
      unmount = true;
    };
  }, [cameraStatus, isLoadedModel, setPoints]);

  /**
   * handle click camera button
   */
  const onClickCamera = React.useCallback(async () => {
    if (cameraStatus === 'active') {
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((s) => {
          s.stop();
        });
        setCameraStatus('inactive');
      }
    }
    if (cameraStatus === 'inactive') {
      const video = videoRef.current;
      if (video) {
        try {
          // await createStream(video);
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
          });
          video.srcObject = stream;
          await video.play();
          setCameraStatus('active');
        } catch (error) {
          console.log(error);
          const errorType = mediaStreamErrorType(error);
          console.log(errorType);
        }
      }
    }
  }, [cameraStatus]);

  return (
    <>
      <button disabled={cameraStatus === 'blocked'} onClick={onClickCamera}>
        {cameraStatus === 'active' && 'stop'}
        {cameraStatus === 'inactive' && 'start'}
        {cameraStatus === 'blocked' && 'start'}
      </button>
      <div
        style={{
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
          style={{
            transform: 'scaleX(-1)',
          }}
        ></video>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'scaleX(-1)',
          }}
        ></canvas>
        <canvas
          id="canvas2"
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'scaleX(-1)',
          }}
        ></canvas>
      </div>

      <style jsx>{`
        video {
          background: #000;
        }
      `}</style>
    </>
  );
};
