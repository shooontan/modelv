import { MediaDeviceHelper } from './MediaDevice';

beforeAll(() => {
  // @ts-ignore
  global.MediaStream = jest.fn();
});

afterAll(() => {
  // @ts-ignore
  delete global.MediaStream;
  // @ts-ignore
  delete global.navigator;
});

const createMockTrack = (): MediaStreamTrack => ({
  enabled: true,
  id: '',
  isolated: false,
  kind: '',
  label: ',',
  muted: false,
  onended: jest.fn(),
  onisolationchange: jest.fn(),
  onmute: jest.fn(),
  onunmute: jest.fn(),
  readyState: 'live',
  applyConstraints: jest.fn(),
  clone: jest.fn(),
  getCapabilities: jest.fn(),
  getConstraints: jest.fn(),
  getSettings: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

const createMockMediaStream = ({
  id,
  track,
}: {
  id: string;
  track: MediaStreamTrack;
}): MediaStream => ({
  id: id,
  active: false,
  onaddtrack: jest.fn(),
  onremovetrack: jest.fn(),
  addTrack: jest.fn(),
  clone: jest.fn(),
  getAudioTracks: jest.fn(),
  getTrackById: jest.fn(),
  getTracks: jest.fn(() => [track]),
  getVideoTracks: jest.fn(),
  removeTrack: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

const createMockMediaDeviceInfo = (opt: {
  id: string;
  kind: MediaDeviceInfo['kind'];
}): MediaDeviceInfo => ({
  deviceId: opt.id,
  groupId: 'group',
  kind: opt.kind,
  label: 'label',
  toJSON: jest.fn(),
});

describe('MediaDeviceHelper', () => {
  const MDHelper = new MediaDeviceHelper();

  const mock = [
    {
      stream: {
        id: 'aaaaa',
      },
      track: createMockTrack(),
    },
    {
      stream: {
        id: 'bbbbb',
      },
      track: createMockTrack(),
    },
    {
      stream: {
        id: 'ccccc',
      },
      track: createMockTrack(),
    },
  ];

  const streams = mock.map((m) =>
    createMockMediaStream({ id: m.stream.id, track: m.track })
  );

  test('addStream', () => {
    expect(MDHelper['streams'].length).toBe(0);
    streams.forEach((stream) => {
      MDHelper.addStream(stream);
    });
    expect(MDHelper['streams'].length).toBe(3);
  });

  test('clearStream', () => {
    MDHelper.clearStream('aaaaa');
    expect(MDHelper['streams'].length).toBe(2);
    expect(streams[0].getTracks).toHaveBeenCalled();
    expect(mock[0].track.stop).toHaveBeenCalled();
    MDHelper.clearStream('11111');
    expect(MDHelper['streams'].length).toBe(2);
    expect(streams[1].getTracks).not.toHaveBeenCalled();
    expect(streams[2].getTracks).not.toHaveBeenCalled();
    expect(mock[1].track.stop).not.toHaveBeenCalled();
    expect(mock[2].track.stop).not.toHaveBeenCalled();
  });

  test('clearAllStream', () => {
    MDHelper.clearAllStream();
    expect(streams[1].getTracks).toHaveBeenCalled();
    expect(streams[2].getTracks).toHaveBeenCalled();
    expect(mock[1].track.stop).toHaveBeenCalled();
    expect(mock[2].track.stop).toHaveBeenCalled();
  });

  test('confirmPermission', async () => {
    const track = createMockTrack();
    const stream = createMockMediaStream({
      id: 'xxxxx',
      track,
    });
    // @ts-ignore
    global.navigator = {
      mediaDevices: {
        getUserMedia: jest.fn(() => stream),
      },
    };
    await MDHelper.confirmPermission();
    expect(MDHelper['streams'].length).toBe(0);
    expect(streams[1].getTracks).toHaveBeenCalled();
  });

  test('getVideoDevices', async () => {
    const mock: { id: string; kind: MediaDeviceKind }[] = [
      { id: '11111', kind: 'audioinput' },
      { id: '22222', kind: 'audiooutput' },
      { id: '33333', kind: 'videoinput' },
    ];
    const info = mock.map((m) => createMockMediaDeviceInfo(m));
    // @ts-ignore
    global.navigator = {
      mediaDevices: {
        enumerateDevices: jest.fn(() => info),
      },
    };
    const devices = await MDHelper.getVideoDevices();
    expect(devices.length).toBe(1);
  });

  test('getVideoStream', async () => {
    const track = createMockTrack();
    const mockStream = createMockMediaStream({
      id: 'ididid',
      track,
    });
    // @ts-ignore
    global.navigator = {
      mediaDevices: {
        getUserMedia: jest.fn(() => mockStream),
      },
    };
    const stream = await MDHelper.getVideoStream('ididid');
    expect(stream.id).toBe('ididid');
    expect(MDHelper['streams'][0].id).toBe('ididid');
  });

  test('clean', () => {
    const track = createMockTrack();
    const mockStream = createMockMediaStream({
      id: 'ididid',
      track,
    });
    MediaDeviceHelper.clean(mockStream);
    expect(mockStream.getTracks).toHaveBeenCalled();
    expect(track.stop).toHaveBeenCalled();
  });
});
