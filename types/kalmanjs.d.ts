declare module 'kalmanjs' {
  export default class KalmanFilter {
    constructor(opt?: { R?: number; Q?: number });
    filter(data?: number): number;
  }
}
