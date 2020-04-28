import React from 'react';
import { HeadPose } from '@/context/HeadPose';
import { aikotoba } from '@/libs/aikotoba';
import { usePeerConnection } from '@/components/hooks/usePeer';

type DataFormat = {
  eulerAngles: {
    pitch: number;
    roll: number;
    yaw: number;
  };
};

export const AnswerPeerConnection = () => {
  const [, setEulerAngles] = HeadPose.EulerAngles.useContainer();

  // for connection
  const [offerSDP, setOfferSDP] = React.useState('');
  const {
    peer,
    dataChannel,
    createAnser,
    sdp,
    refresh,
    connectionState,
  } = usePeerConnection();

  /**
   * send data
   */
  React.useEffect(() => {
    if (!dataChannel) {
      return;
    }
    dataChannel.onmessage = (e) => {
      const data = JSON.parse(e.data) as DataFormat;
      setEulerAngles(data.eulerAngles);
    };
  }, [dataChannel, setEulerAngles]);

  /**
   * refresh connection
   */
  React.useEffect(() => {
    if (
      dataChannel?.readyState === 'closed' ||
      connectionState === 'closed' ||
      connectionState === 'disconnected'
    ) {
      refresh();
    }
  }, [dataChannel, connectionState, refresh]);

  if (dataChannel?.readyState === 'open') {
    return null;
  }

  return (
    <div>
      {!peer && (
        <>
          <button
            onClick={() => {
              try {
                const decodeSDP = aikotoba.decode(offerSDP);
                createAnser(decodeSDP);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            コネクトキーを入力する
          </button>
          <textarea
            value={offerSDP}
            onChange={(e) => setOfferSDP(e.target.value)}
          />
        </>
      )}

      {peer && (
        <>
          <p>リターンキー</p>
          <p>{aikotoba.encode(sdp || '')}</p>
        </>
      )}
    </div>
  );
};
