export class MediaDeviceHelper {
  private streams: MediaStream[] = [];

  static isMediaStream(data: unknown): data is MediaStream {
    return data instanceof MediaStream;
  }

  static clean(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  async getVideoStream(deviceId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: deviceId,
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
    });
    this.addStream(stream);
    return stream;
  }

  async getVideoDevices() {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter(
      (device) => device.kind === 'videoinput'
    );
    return videoDevices;
  }

  async confirmPermission() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    this.addStream(stream);
    this.clearStream(stream.id);
  }

  addStream(stream: MediaStream) {
    this.streams.push(stream);
  }

  clearStream(streamId: string) {
    const streamIdx = this.streams.findIndex(
      (stream) => stream.id === streamId
    );
    if (streamIdx > -1) {
      this.streams[streamIdx].getTracks().forEach((track) => {
        track.stop();
      });
      this.streams.splice(streamIdx, 1);
    }
  }

  clearAllStream() {
    this.streams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
    this.streams = [];
  }
}
