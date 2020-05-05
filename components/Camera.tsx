import React from 'react';
// import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import { Landmark } from '@/context/Landmark';
import { KalmanFilter } from '@/libs/KalmanFilter';
import { mediaStreamErrorType } from '@/libs/media/error';

type Size = [number, number];
const DEFAULT_CANVAS_SIZE: Size = [640, 480];

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
  const [videoStreamSize, setVideoStreamSize] = React.useState<Size>(
    DEFAULT_CANVAS_SIZE
  );

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

      const trackSettings = (video.srcObject as MediaStream)
        .getTracks()[0]
        .getSettings();
      const { width, height } = trackSettings;

      const isNum = (value: any): value is number => typeof value === 'number';
      const videoWidth = isNum(width) ? width : videoStreamSize[0];
      const videoHeight = isNum(height) ? height : videoStreamSize[1];
      if (
        videoWidth !== videoStreamSize[0] ||
        videoHeight !== videoStreamSize[1]
      ) {
        setVideoStreamSize([videoWidth, videoHeight]);
      }

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
        width: canvas.width,
        height: canvas.height,
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
  }, [cameraStatus, isLoadedModel, videoStreamSize, setPoints]);

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

  const isLandscapeVideoStream = videoStreamSize[0] >= videoStreamSize[1];

  const videoDomSize: Size = videoRef.current
    ? [videoRef.current.clientWidth, videoRef.current.clientHeight]
    : DEFAULT_CANVAS_SIZE;

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 640,
          height: 480,
          margin: 0,
        }}
      >
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas
          ref={canvasRef}
          width={videoDomSize[0]}
          height={videoDomSize[1]}
        />
        <canvas id="canvas2" width={videoDomSize[0]} height={videoDomSize[1]} />
      </div>

      <button disabled={cameraStatus === 'blocked'} onClick={onClickCamera}>
        {cameraStatus === 'active' && 'stop'}
        {cameraStatus === 'inactive' && 'start'}
        {cameraStatus === 'blocked' && 'start'}
      </button>

      <style jsx>{`
        div {
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
