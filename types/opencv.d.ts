interface OpenCVJS {
  CV_64FC1: OpenCV.MatType;

  Mat: OpenCV.IMat;

  matFromArray(
    rows: number,
    cols: number,
    type: MatType,
    array: number[]
  ): OpenCV.Mat;

  // TODO return type
  imread(img: HTMLElement): OpenCV.Mat;
  imshow(name: string, img: OpenCV.Mat);
  line(
    img: OpenCV.Mat,
    pt1: { x: number; y: number },
    pt2: { x: number; y: number },
    color: [number, number, number, number],
    thickness = 1
  );

  Rodrigues(src: OpenCV.Mat, dst: OpenCV.Mat);

  solvePnP(
    objectPoints: OpenCV.Mat,
    imagePoints: OpenCV.Mat,
    cameraMatrix: OpenCV.Mat,
    distCoeffs: OpenCV.Mat,
    rvec: OpenCV.Mat,
    tvec: OpenCV.Mat,
    useExtrinsicGuess = false
  ): boolean;

  projectPoints(
    objectPoints: OpenCV.Mat,
    rvec: OpenCV.Mat,
    tvec: OpenCV.Mat,
    cameraMatrix: OpenCV.Mat,
    distCoeffs: OpenCV.Mat,
    imagePoints: OpenCV.Mat,
    jacobian: OpenCV.Mat
  ): void;

  decomposeProjectionMatrix(
    projMatrix: OpenCV.Mat,
    cameraMatrix: OpenCV.Mat,
    rotMatrix: OpenCV.Mat,
    transVect: OpenCV.Mat,
    rotMatrX: OpenCV.Mat,
    rotMatrY: OpenCV.Mat,
    rotMatrZ: OpenCV.Mat,
    eulerAngles: OpenCV.Mat
  ): void;
}

declare namespace OpenCV {
  type MatType = number;

  interface IMat {
    new (width: number, height: number, type: OpenCV.MatType): Mat;
    new ({ width: number, height: number }, type: OpenCV.MatType): Mat;
    new (...args: any): Mat;
    zeros(rows: number, cols: number, type: OpenCV.MatType): Mat;
  }

  class Mat {
    data64F: Float64Array;
    delete(): void;
  }
}
