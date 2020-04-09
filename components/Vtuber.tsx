import React from 'react';
// import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';

export const Video = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    fn();
    async function fn() {
      await faceapi.nets.tinyFaceDetector.loadFromUri('models/weights');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/weights');
      await faceapi.nets.faceExpressionNet.loadFromUri('models/weights');

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
      video.play();

      const aaa = async () => {
        setTimeout(() => aaa());

        // ウェブカメラの映像から顔データを取得
        const useTinyModel = true;
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks(useTinyModel)
          .withFaceExpressions();

        // 顔データをリサイズ
        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.width,
          height: video.height,
        });

        // キャンバスに描画
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      };
      aaa();
    }
  }, []);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <video ref={videoRef} width="720" height="560"></video>
      <canvas
        ref={canvasRef}
        width="720"
        height="560"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      ></canvas>
    </div>
  );
};
