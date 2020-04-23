import React from 'react';
// import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import { Landmark } from '../context/Landmark';

const CANVAS_SIZE = [640, 480] as const;

function formatPoint(point?: faceapi.Point): [number, number] | undefined {
  return point && typeof point.x === 'number' && typeof point.y === 'number'
    ? [point.x, point.y]
    : undefined;
}

export const Camera = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = React.useState<boolean>(false);
  const [, setPoints] = Landmark.Points.useContainer();

  React.useEffect(() => {
    init();
    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return console.log('video or canvas is null');
      }
      video.srcObject = stream;
      await video.play();

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('models/weights'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/weights'),
      ]);

      setCameraActive(true);

      return () => {
        stream.getTracks().forEach((track) => {
          console.log(track);
          track.stop();
        });
      };
    }
  }, []);

  React.useEffect(() => {
    if (!cameraActive) {
      return;
    }

    detect();
    async function detect() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return console.log('video or canvas is null');
      }

      requestAnimationFrame(detect);

      // ウェブカメラの映像から顔データを取得
      const useTinyModel = true;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(useTinyModel);

      // 顔データをリサイズ
      const resizedDetections = faceapi.resizeResults(detections, {
        width: video.width,
        height: video.height,
      });

      // キャンバスに描画
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      // 座標を更新
      const landmarks = resizedDetections[0]?.landmarks;
      const nose = landmarks?.getNose()[3];
      const leftEye = landmarks?.getLeftEye()[0];
      const rightEye = landmarks?.getRightEye()[3];
      const jaw = landmarks?.getJawOutline()[8];
      const leftMouth = landmarks?.getMouth()[0];
      const rightMouth = landmarks?.getMouth()[6];
      setPoints({
        nose: formatPoint(nose),
        leftEye: formatPoint(leftEye),
        rightEye: formatPoint(rightEye),
        jaw: formatPoint(jaw),
        leftMouth: formatPoint(leftMouth),
        rightMouth: formatPoint(rightMouth),
      });
    }
  }, [cameraActive]);

  return (
    <>
      <div
        style={{
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
        ></video>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
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
          }}
        ></canvas>
      </div>
    </>
  );
};
