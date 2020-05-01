import { mediaStreamErrorType } from './error';

class DOMException extends Error {
  constructor(name: string, message?: string) {
    super(message);
    this.name = name;
  }
}

beforeAll(() => {
  // @ts-ignore
  global.DOMException = DOMException;
});

afterAll(() => {
  // @ts-ignore
  delete global.DOMException;
});

describe.each([
  [new Error(), 'Error'],
  [new DOMException(''), 'Error'],
  [new DOMException('UnexpectedName'), 'Error'],
  [new DOMException('NotFoundError'), 'NotFoundError'],
  [new DOMException('DevicesNotFoundError'), 'NotFoundError'],
  [new DOMException('NotReadableError'), 'NotReadableError'],
  [new DOMException('TrackStartError'), 'NotReadableError'],
  [new DOMException('NotAllowedError'), 'NotAllowedError'],
  [new DOMException('PermissionDeniedError'), 'NotAllowedError'],
])(
  'type: mediaStreamErrorType',
  (error: Error | DOMException, expected: string) => {
    test(`type: ${expected}`, () => {
      expect(mediaStreamErrorType(error)).toBe(expected);
    });
  }
);
