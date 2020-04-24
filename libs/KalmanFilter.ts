import KFilter from 'kalmanjs';

type Options = { R?: number; Q?: number; d?: 1 | 2 | 3 };

const defaultOpts = {
  R: 0.2,
  d: 2,
};

export class KalmanFilter {
  _kfilter: KFilter[] = [];

  constructor(opts?: Options) {
    const { d, ...rest } = { ...defaultOpts, ...opts };
    const dim = d || 1;
    for (let i = 0; i < dim; i++) {
      this._kfilter.push(new KFilter(rest));
    }
  }

  filter(data: number[]) {
    return this._kfilter.map((f, idx) => {
      return f.filter(data[idx]);
    });
  }
}
