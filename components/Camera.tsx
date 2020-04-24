import React from 'react';
// import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import { Landmark } from '../context/Landmark';
import { KalmanFilter } from '../libs/KalmanFilter';

const CANVAS_SIZE = [640, 480] as const;

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

async function createStream(video: HTMLVideoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  await video.play();
}

export const Camera = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = React.useState<boolean>(false);
  const [, setPoints] = Landmark.Points.useContainer();

  React.useEffect(() => {
    init();
    async function init() {
      await Promise.all([
        createStream(videoRef.current!),
        faceapi.nets.tinyFaceDetector.loadFromUri('models/weights'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/weights'),
      ]);
      setCameraActive(true);
    }
  }, []);

  React.useEffect(() => {
    if (!cameraActive) {
      return;
    }

    if (faceapi.nets.tinyFaceDetector.isLoaded) {
      createStream(videoRef.current!);
    }

    detect();
    async function detect() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return console.log('video or canvas is null');
      }

      cameraActive && requestAnimationFrame(detect);

      // ウェブカメラの映像から顔データを取得
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

      // 顔データをリサイズ
      const resizedDetection = faceapi.resizeResults(detection, {
        width: video.width,
        height: video.height,
      });

      // キャンバスに描画
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

      // 座標を更新
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
  }, [cameraActive]);

  return (
    <>
      <button
        onClick={() => {
          if (cameraActive) {
            const stream = videoRef.current?.srcObject;
            if (stream instanceof MediaStream) {
              stream.getTracks().forEach((s) => {
                s.stop();
              });
            }
          }
          setCameraActive(!cameraActive);
        }}
      >
        {cameraActive ? 'stop' : 'start'}
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
    </>
  );
};
