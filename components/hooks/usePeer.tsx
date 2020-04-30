import React from 'react';

type Configuration = RTCConfiguration;

const defaultConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

/**
 * WebRTC peer connection custom hook
 */
export function usePeerConnection(config: Configuration = defaultConfig) {
  const [
    peerConnection,
    setPeerConnection,
  ] = React.useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = React.useState<RTCDataChannel | null>(
    null
  );
  const [sdp, setSDP] = React.useState<string>();
  const [connectionState, setConnectionState] = React.useState<
    RTCPeerConnectionState
  >();

  /**
   * refrech state
   */
  const refresh = React.useCallback(() => {
    peerConnection && peerConnection.close();
    setPeerConnection(null);
    setPeerConnection(null);
    setSDP('');
    setConnectionState(undefined);
  }, [peerConnection]);

  /**
   * offer
   */
  const createOffer = React.useCallback(async () => {
    const peer = new RTCPeerConnection(config);

    peer.onicecandidate = (e) => {
      if (e.candidate === null) {
        setSDP(peer.localDescription?.sdp);
      }
    };

    peer.onconnectionstatechange = () => {
      setConnectionState(peer.connectionState);
      // close event
      if (peer.connectionState === 'disconnected') {
        peer.close();
      }
    };

    const dataChannel = peer.createDataChannel('RTCDataChannel');
    setDataChannel(dataChannel);

    // close event
    dataChannel.onclose = () => {
      peer.close();
    };

    try {
      const sessionDescription = await peer.createOffer();
      peer.setLocalDescription(sessionDescription);
      setPeerConnection(peer);
    } catch (error) {
      console.log(error);
    }
  }, [config]);

  /**
   * answer
   */
  const createAnser = React.useCallback(
    async (offerSDP: string) => {
      const peer = new RTCPeerConnection(config);

      peer.onicecandidate = (e) => {
        if (e.candidate === null) {
          setSDP(peer.localDescription?.sdp);
        }
      };

      peer.onconnectionstatechange = () => {
        console.log(peer.connectionState);
        setConnectionState(peer.connectionState);
        if (peer.connectionState === 'disconnected') {
          peer.close();
        }
      };

      const offerDescription = new RTCSessionDescription({
        type: 'offer',
        sdp: offerSDP,
      });

      try {
        await peer.setRemoteDescription(offerDescription);
        const sessionDescription = await peer.createAnswer();
        await peer.setLocalDescription(sessionDescription);
        setPeerConnection(peer);

        peer.ondatachannel = (e) => {
          const dataChannel = e.channel;
          setDataChannel(dataChannel);

          dataChannel.onclose = () => {
            peer.close();
            setConnectionState('closed');
          };
        };
      } catch (error) {
        console.log(error);
      }
    },
    [config]
  );

  return {
    peer: peerConnection,
    dataChannel: dataChannel,
    connectionState: connectionState,
    sdp: sdp,
    createOffer: createOffer,
    createAnser: createAnser,
    refresh: refresh,
  };
}
