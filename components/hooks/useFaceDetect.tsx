import React from 'react';
import * as faceapi from 'face-api.js';
import { MediaDeviceHelper } from '@/libs/media/MediaDevice';

const RENDER_THROTTLE = 5;

type Config = {
  active: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoSize: {
    width: number;
    height: number;
  };
};

const isNum = (value: any): value is number => typeof value === 'number';

const isModelLoaded = () =>
  faceapi.nets.tinyFaceDetector.isLoaded &&
  faceapi.nets.faceLandmark68TinyNet.isLoaded;

const MDHelper = new MediaDeviceHelper();

export function useFaceDetect(config: Config) {
  const { videoRef, canvasRef } = config;
  const unmounted = React.useRef<boolean>(false);
  const [points, setPoints] = React.useState<{
    nose?: faceapi.Point;
    leftEye?: faceapi.Point;
    rightEye?: faceapi.Point;
    leftMouth?: faceapi.Point;
    rightMouth?: faceapi.Point;
    upperLip?: faceapi.Point;
    lowerLip?: faceapi.Point;
    jaw?: faceapi.Point;
    leftOutline?: faceapi.Point;
    rightOutline?: faceapi.Point;
  }>({});
  const [videoStreamSize, setVideoStreamSize] = React.useState<{
    width: number;
    height: number;
  }>(config.videoSize);
  const [renderCount, setRenderCount] = React.useState<number>(0);

  React.useEffect(() => {
    return () => {
      MDHelper.clearAllStream();
      unmounted.current = true;
    };
  }, []);

  /**
   * load face-api.js models
   */
  React.useEffect(() => {
    async function loadNets() {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('models/weights'),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/weights'),
        ]);
      } catch (error) {
        console.log(error);
      }
    }

    if (!isModelLoaded()) {
      loadNets();
    }
  }, []);

  const createStream = async () => {
    await MDHelper.confirmPermission();
    const devices = await MDHelper.getVideoDevices();
    const stream = await MDHelper.getVideoStream(devices[0].deviceId);
    if (videoRef.current && MediaDeviceHelper.isMediaStream(stream)) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopDetect = (video: HTMLVideoElement) => {
    const stream = video.srcObject;
    if (MediaDeviceHelper.isMediaStream(stream)) {
      MDHelper.clearAllStream();
      video.srcObject = null;
    }
  };

  const detect = React.useCallback(
    async (renderThrottleCount: number) => {
      const video = videoRef.current;
      const stream = video?.srcObject;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        return console.log('video or canvas is null');
      }

      if (!MediaDeviceHelper.isMediaStream(stream)) {
        return console.log('not exist video stream');
      }

      // skip anime in 4/5
      const nextRenderCount = (renderThrottleCount + 1) % RENDER_THROTTLE;
      requestAnimationFrame(() => detect(nextRenderCount));
      if (renderThrottleCount !== 0) {
        !unmounted && setRenderCount(nextRenderCount);
        return;
      }

      if (!isModelLoaded()) {
        return;
      }

      const trackSettings = stream.getTracks()[0].getSettings();
      const { width, height } = trackSettings;

      const videoWidth = isNum(width) ? width : videoStreamSize.width;
      const videoHeight = isNum(height) ? height : videoStreamSize.height;
      if (
        videoWidth !== videoStreamSize.width ||
        videoHeight !== videoStreamSize.height
      ) {
        // !unmounted.current &&
        setVideoStreamSize({ width: videoWidth, height: videoHeight });
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

      !unmounted.current &&
        setPoints({
          nose,
          leftEye,
          rightEye,
          jaw,
          leftMouth,
          rightMouth,
          upperLip,
          lowerLip,
          leftOutline,
          rightOutline,
        });
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [videoStreamSize.width, videoStreamSize.height]
  );

  const isLandscapeVideoStream =
    videoStreamSize.width >= videoStreamSize.height;

  const videoDomSize = videoRef.current
    ? {
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight,
      }
    : config.videoSize;

  return {
    points,
    isLandscapeVideoStream,
    videoDomSize,
    renderCount,
    createStream,
    detect,
    stopDetect,
  };
}
