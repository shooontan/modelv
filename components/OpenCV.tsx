import React from 'react';
import Head from 'next/head';
import { Landmark } from '../context/Landmark';
import { HeadPose } from '../context/HeadPose';

export const OpenCV = () => {
  const [points] = Landmark.Points.useContainer();
  const [, setRotation] = HeadPose.RotationVec.useContainer();
  const [, setTranslation] = HeadPose.TranslationVec.useContainer();
  const [, setEulerAngles] = HeadPose.EulerAngles.useContainer();

  React.useEffect(() => {
    const cv = window.cv;
    if (!cv || !cv.Mat) {
      return;
    }

    // capture model points
    const detectPoints = [
      // nose
      ...[0.0, 0.0, 0.0],
      // jaw
      // ...[0.0, -270, 0.0],
      ...[0, -330, -65],
      // left eye
      // ...[-144, 105, -90],
      ...[-240, 170, -135],
      // right eye
      // ...[144, 105, -90],
      ...[240, 170, -135],
      // left mouth
      // ...[-99, -99, -45],
      ...[-150, -150, -125],
      // right mouth
      // ...[99, -99, -45],
      ...[150, -150, -125],
      // left outline
      ...[-480, 170, -340],
      // right outline
      ...[480, 170, -340],
    ];
    const rows = detectPoints.length / 3;
    const modelPoints = cv.matFromArray(rows, 3, cv.CV_64FC1, detectPoints);

    // camera matrix
    const size = {
      width: 640,
      height: 480,
    };
    const center = [size.width / 2, size.height / 2];
    const cameraMatrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
      ...[size.width, 0, center[0]],
      ...[0, size.width, center[1]],
      ...[0, 0, 1],
    ]);

    // image matrix
    const imagePoints = cv.Mat.zeros(rows, 2, cv.CV_64FC1);
    const distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64FC1);
    const rvec = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
    const tvec = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);

    const {
      nose,
      leftMouth,
      rightMouth,
      jaw,
      leftEye,
      rightEye,
      leftOutline,
      rightOutline,
    } = points;

    if (
      nose &&
      leftMouth &&
      rightMouth &&
      jaw &&
      leftEye &&
      rightEye &&
      leftOutline &&
      rightOutline
    ) {
      [
        ...nose,
        ...jaw,
        ...leftEye,
        ...rightEye,
        ...leftMouth,
        ...rightMouth,
        ...leftOutline,
        ...rightOutline,
      ].map((v, i) => {
        imagePoints.data64F[i] = v;
      });

      // initialize transition and rotation matrixes to improve estimation
      tvec.data64F[0] = -100;
      tvec.data64F[1] = 100;
      tvec.data64F[2] = 1000;
      const distToLeftEyeX = Math.abs(leftEye[0] - nose[0]);
      const distToRightEyeX = Math.abs(rightEye[0] - nose[0]);
      if (distToLeftEyeX < distToRightEyeX) {
        // looking at left
        rvec.data64F[0] = -1.0;
        rvec.data64F[1] = -0.75;
        rvec.data64F[2] = -3.0;
      } else {
        // looking at right
        rvec.data64F[0] = 1.0;
        rvec.data64F[1] = -0.75;
        rvec.data64F[2] = -3.0;
      }

      const success = cv.solvePnP(
        modelPoints,
        imagePoints,
        cameraMatrix,
        distCoeffs,
        rvec,
        tvec,
        true
      );

      if (success) {
        if (
          (rvec && rvec.data64F?.every((v) => !isNaN(v))) ||
          (tvec && tvec.data64F?.every((v) => !isNaN(v)))
        ) {
          setRotation(rvec.data64F);
          setTranslation(tvec.data64F);

          const nose_end_point2DZ = new cv.Mat();
          const nose_end_point2DY = new cv.Mat();
          const nose_end_point2DX = new cv.Mat();

          const pointZ = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 0.0, 500.0]);
          const pointY = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 500.0, 0.0]);
          const pointX = cv.matFromArray(1, 3, cv.CV_64FC1, [500.0, 0.0, 0.0]);
          const jaco = new cv.Mat();

          // Project a 3D points [0.0, 0.0, 500.0],  [0.0, 500.0, 0.0],
          //   [500.0, 0.0, 0.0] as z, y, x axis in red, green, blue color
          cv.projectPoints(
            pointZ,
            rvec,
            tvec,
            cameraMatrix,
            distCoeffs,
            nose_end_point2DZ,
            jaco
          );
          cv.projectPoints(
            pointY,
            rvec,
            tvec,
            cameraMatrix,
            distCoeffs,
            nose_end_point2DY,
            jaco
          );
          cv.projectPoints(
            pointX,
            rvec,
            tvec,
            cameraMatrix,
            distCoeffs,
            nose_end_point2DX,
            jaco
          );

          const canvas2 = document.getElementById(
            'canvas2'
          ) as HTMLCanvasElement;
          canvas2
            .getContext('2d')
            ?.clearRect(0, 0, canvas2.width, canvas2.height);

          const img = cv.imread(document.getElementById('canvas2')!);

          // draw axis
          const pNose = {
            x: imagePoints.data64F[0],
            y: imagePoints.data64F[1],
          };
          const pZ = {
            x: nose_end_point2DZ.data64F[0],
            y: nose_end_point2DZ.data64F[1],
          };
          const p3 = {
            x: nose_end_point2DY.data64F[0],
            y: nose_end_point2DY.data64F[1],
          };
          const p4 = {
            x: nose_end_point2DX.data64F[0],
            y: nose_end_point2DX.data64F[1],
          };
          cv.line(img, pNose, pZ, [255, 0, 0, 255], 2);
          cv.line(img, pNose, p3, [0, 255, 0, 255], 2);
          cv.line(img, pNose, p4, [0, 0, 255, 255], 2);
          cv.imshow('canvas2', img);

          const rmat = new cv.Mat();
          cv.Rodrigues(rvec, rmat);

          const projectMat = cv.Mat.zeros(3, 4, cv.CV_64FC1);
          projectMat.data64F[0] = rmat.data64F[0];
          projectMat.data64F[1] = rmat.data64F[1];
          projectMat.data64F[2] = rmat.data64F[2];
          projectMat.data64F[4] = rmat.data64F[3];
          projectMat.data64F[5] = rmat.data64F[4];
          projectMat.data64F[6] = rmat.data64F[5];
          projectMat.data64F[8] = rmat.data64F[6];
          projectMat.data64F[9] = rmat.data64F[7];
          projectMat.data64F[10] = rmat.data64F[8];

          const cmat = new cv.Mat();
          const rotmat = new cv.Mat();
          const travec = new cv.Mat();
          const rotmatX = new cv.Mat();
          const rotmatY = new cv.Mat();
          const rotmatZ = new cv.Mat();
          const eulerAngles = new cv.Mat();
          cv.decomposeProjectionMatrix(
            projectMat,
            cmat,
            rotmat,
            travec,
            rotmatX,
            rotmatY,
            rotmatZ,
            eulerAngles
          );

          setEulerAngles({
            yaw: eulerAngles.data64F[1],
            pitch: eulerAngles.data64F[0],
            roll: eulerAngles.data64F[2],
          });

          img.delete();
          pointZ.delete();
          pointY.delete();
          pointX.delete();
          nose_end_point2DZ.delete();
          nose_end_point2DX.delete();
          nose_end_point2DY.delete();
          jaco.delete();

          rmat.delete();
          projectMat.delete();
          cmat.delete();
          rotmat.delete();
          travec.delete();
          rotmatX.delete();
          rotmatY.delete();
          rotmatZ.delete();
          eulerAngles.delete();
        }
      }
    }

    imagePoints.delete();
    distCoeffs.delete();
    rvec.delete();
    tvec.delete();

    return () => {};
  }, [points]);

  return (
    <Head>
      <script src="/js/opencv.js" type="text/javascript"></script>
    </Head>
  );
};

export default OpenCV;
