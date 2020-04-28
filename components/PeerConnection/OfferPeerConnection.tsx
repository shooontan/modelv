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

export const OfferPeerConnection = () => {
  const [eulerAngles] = HeadPose.EulerAngles.useContainer();

  // for connection
  const [answerSDP, setAnswerSDP] = React.useState('');
  const {
    peer,
    dataChannel,
    createOffer,
    sdp,
    connectionState,
    refresh,
  } = usePeerConnection();

  /**
   * send data
   */
  React.useEffect(() => {
    if (eulerAngles && dataChannel && dataChannel.readyState === 'open') {
      const data: DataFormat = {
        eulerAngles: eulerAngles,
      };

      try {
        dataChannel.send(JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [dataChannel, eulerAngles]);

  /**
   * reconnect
   */
  const handleReconnect = React.useCallback(async () => {
    peer?.close();
    dataChannel?.close();
    refresh();
  }, [peer, dataChannel, refresh]);

  /**
   * answer
   */
  const handleAnser = React.useCallback(async () => {
    const answerDescription = new RTCSessionDescription({
      type: 'answer',
      sdp: aikotoba.decode(answerSDP),
    });
    try {
      await peer?.setRemoteDescription(answerDescription);
    } catch (error) {
      console.log(error);
    }
  }, [peer, answerSDP]);

  const showReconnectBtn =
    // 接続中
    (peer && dataChannel?.readyState !== 'open') ||
    // 切断
    dataChannel?.readyState === 'closed';

  return (
    <div>
      {showReconnectBtn && (
        <div>
          <button onClick={handleReconnect}>再接続する</button>
        </div>
      )}

      {!peer && connectionState !== 'disconnected' && (
        <button onClick={createOffer}>コネクトキーを生成する</button>
      )}

      {dataChannel &&
        dataChannel.readyState !== 'open' &&
        connectionState !== 'disconnected' && (
          <>
            <p>コネクトキー</p>
            <p>{aikotoba.encode(sdp || '')}</p>
            <button onClick={handleAnser} disabled={!answerSDP}>
              リターンキーを入力する
            </button>
            <textarea
              value={answerSDP}
              onChange={(e) => setAnswerSDP(e.target.value)}
            />
          </>
        )}
    </div>
  );
};
