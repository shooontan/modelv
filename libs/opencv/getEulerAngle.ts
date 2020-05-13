import { Points } from '@/modules/landmark';

const detectPoints = [
  // nose
  ...[0, 0, 0],
  // jaw
  ...[0, -330, -65],
  // left eye
  ...[-240, 170, -135],
  // right eye
  ...[240, 170, -135],
  // left mouth
  ...[-150, -150, -125],
  // right mouth
  ...[150, -150, -125],
  // left outline
  ...[-480, 170, -340],
  // right outline
  ...[480, 170, -340],
];

const cameraSize = {
  width: 640,
  height: 480,
};
const cameraCenter = [cameraSize.width / 2, cameraSize.height / 2];

const rows = detectPoints.length / 3;

export class OPCV {
  private _modelPoints: OpenCV.Mat;
  private _cameraMatrix: OpenCV.Mat;
  private _imagePoints: OpenCV.Mat;
  private _distCoeffs: OpenCV.Mat;

  private _pointX: OpenCV.Mat;
  private _pointY: OpenCV.Mat;
  private _pointZ: OpenCV.Mat;

  constructor() {
    this._modelPoints = window.cv.matFromArray(
      rows,
      3,
      window.cv.CV_64FC1,
      detectPoints
    );
    this._cameraMatrix = window.cv.matFromArray(3, 3, window.cv.CV_64FC1, [
      ...[cameraSize.width, 0, cameraCenter[0]],
      ...[0, cameraSize.width, cameraCenter[1]],
      ...[0, 0, 1],
    ]);
    this._imagePoints = window.cv.Mat.zeros(rows, 2, window.cv.CV_64FC1);
    this._distCoeffs = window.cv.Mat.zeros(4, 1, window.cv.CV_64FC1);

    this._pointX = window.cv.matFromArray(1, 3, window.cv.CV_64FC1, [
      500.0,
      0.0,
      0.0,
    ]);
    this._pointY = window.cv.matFromArray(1, 3, window.cv.CV_64FC1, [
      0.0,
      500.0,
      0.0,
    ]);
    this._pointZ = window.cv.matFromArray(1, 3, window.cv.CV_64FC1, [
      0.0,
      0.0,
      500.0,
    ]);
  }

  delete() {
    this._modelPoints.delete();
    this._cameraMatrix.delete();
    this._imagePoints.delete();
    this._distCoeffs.delete();
    this._pointX.delete();
    this._pointY.delete();
    this._pointZ.delete();
  }

  getProjectPoints({ rvec, tvec }: { rvec: OpenCV.Mat; tvec: OpenCV.Mat }) {
    const noseEndPoint2DZ = new window.cv.Mat();
    const noseEndPoint2DY = new window.cv.Mat();
    const noseEndPoint2DX = new window.cv.Mat();
    const jaco = new window.cv.Mat();

    // Project a 3D points
    window.cv.projectPoints(
      this._pointZ,
      rvec,
      tvec,
      this._cameraMatrix!,
      this._distCoeffs,
      noseEndPoint2DZ,
      jaco
    );
    window.cv.projectPoints(
      this._pointY,
      rvec,
      tvec,
      this._cameraMatrix!,
      this._distCoeffs,
      noseEndPoint2DY,
      jaco
    );
    window.cv.projectPoints(
      this._pointX,
      rvec,
      tvec,
      this._cameraMatrix!,
      this._distCoeffs,
      noseEndPoint2DX,
      jaco
    );

    const points = {
      nose: {
        x: this._imagePoints.data64F[0],
        y: this._imagePoints.data64F[1],
      },
      x: {
        x: noseEndPoint2DX.data64F[0],
        y: noseEndPoint2DX.data64F[1],
      },
      y: {
        x: noseEndPoint2DY.data64F[0],
        y: noseEndPoint2DY.data64F[1],
      },
      z: {
        x: noseEndPoint2DZ.data64F[0],
        y: noseEndPoint2DZ.data64F[1],
      },
    };

    noseEndPoint2DZ.delete();
    noseEndPoint2DX.delete();
    noseEndPoint2DY.delete();
    jaco.delete();

    return points;
  }

  estimateEulerAngles(points: Points) {
    let calcValue: {
      eulerAngles?: {
        pitch: number;
        yaw: number;
        roll: number;
      };
      projectPoints?: ReturnType<OPCV['getProjectPoints']>;
    } = {};

    const rvec = new window.cv.Mat({ width: 1, height: 3 }, window.cv.CV_64FC1);
    const tvec = new window.cv.Mat({ width: 1, height: 3 }, window.cv.CV_64FC1);

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
      const flat2DPoints = [
        ...nose,
        ...jaw,
        ...leftEye,
        ...rightEye,
        ...leftMouth,
        ...rightMouth,
        ...leftOutline,
        ...rightOutline,
      ];
      for (let idx = 0; idx < flat2DPoints.length; idx++) {
        this._imagePoints.data64F[idx] = flat2DPoints[idx];
      }

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

      const success = window.cv.solvePnP(
        this._modelPoints,
        this._imagePoints,
        this._cameraMatrix,
        this._distCoeffs,
        rvec,
        tvec,
        true
      );

      if (success) {
        if (
          (rvec.data64F || []).every((v) => !isNaN(v)) ||
          (tvec.data64F || []).every((v) => !isNaN(v))
        ) {
          calcValue.projectPoints = this.getProjectPoints({ rvec, tvec });

          const rmat = new window.cv.Mat();
          window.cv.Rodrigues(rvec, rmat);

          const projectMat = window.cv.Mat.zeros(3, 4, window.cv.CV_64FC1);
          projectMat.data64F[0] = rmat.data64F[0];
          projectMat.data64F[1] = rmat.data64F[1];
          projectMat.data64F[2] = rmat.data64F[2];
          projectMat.data64F[4] = rmat.data64F[3];
          projectMat.data64F[5] = rmat.data64F[4];
          projectMat.data64F[6] = rmat.data64F[5];
          projectMat.data64F[8] = rmat.data64F[6];
          projectMat.data64F[9] = rmat.data64F[7];
          projectMat.data64F[10] = rmat.data64F[8];

          const cmat = new window.cv.Mat();
          const rotmat = new window.cv.Mat();
          const travec = new window.cv.Mat();
          const rotmatX = new window.cv.Mat();
          const rotmatY = new window.cv.Mat();
          const rotmatZ = new window.cv.Mat();
          const eulerAngles = new window.cv.Mat();

          window.cv.decomposeProjectionMatrix(
            projectMat,
            cmat,
            rotmat,
            travec,
            rotmatX,
            rotmatY,
            rotmatZ,
            eulerAngles
          );

          calcValue.eulerAngles = {
            yaw: eulerAngles.data64F[1],
            pitch: eulerAngles.data64F[0],
            roll: eulerAngles.data64F[2],
          };

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

    rvec.delete();
    tvec.delete();

    return calcValue;
  }
}
