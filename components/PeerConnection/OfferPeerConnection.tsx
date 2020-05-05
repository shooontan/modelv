import React from 'react';
import { HeadPose } from '@/context/HeadPose';
import { aikotoba } from '@/libs/aikotoba';
import { usePeerConnection } from '@/components/hooks/usePeer';
import { Button } from '@/components/atoms/Button';

type DataFormat = {
  eulerAngles: {
    pitch: number;
    roll: number;
    yaw: number;
  };
};

type ConnectionStep = 'idle' | 'offered' | 'connectiong' | 'error';

export const OfferPeerConnection = () => {
  const [eulerAngles] = HeadPose.EulerAngles.useContainer();
  const [connectionStep, setConnectionStep] = React.useState<ConnectionStep>(
    'idle'
  );

  // for connection
  const [answerSDP, setAnswerSDP] = React.useState('');
  const {
    peer,
    dataChannel,
    createOffer,
    sdp,
    connectionState,
    // refresh,
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
   * answer
   */
  const handleAnser = React.useCallback(async () => {
    const answerDescription = new RTCSessionDescription({
      type: 'answer',
      sdp: aikotoba.decode(answerSDP),
    });
    try {
      await peer?.setRemoteDescription(answerDescription);
      setConnectionStep('connectiong');
    } catch (error) {
      setConnectionStep('error');
      console.log(error);
    }
  }, [peer, answerSDP]);

  /**
   * display value
   */
  let displayStatus = '';
  switch (connectionStep) {
    case 'idle': {
      displayStatus = '未接続';
      break;
    }
    case 'offered': {
      displayStatus = '接続待ち';
      break;
    }
    case 'connectiong': {
      displayStatus = '接続中';
      break;
    }
    case 'error': {
      displayStatus = 'エラー発生';
      break;
    }
  }

  return (
    <>
      <p>status: {displayStatus}</p>
      {
        // generate buttton
        !peer && connectionState !== 'disconnected' && (
          <Button
            onClick={async () => {
              try {
                await createOffer();
                setConnectionStep('offered');
              } catch (error) {
                setConnectionStep('error');
                console.log(error);
              }
            }}
          >
            コネクトキーを生成する
          </Button>
        )
      }

      {
        // connect key
        peer && sdp && connectionStep === 'offered' && (
          <>
            <div className="keyframe">
              <p className="keyname">コネクトキー</p>
              <textarea rows={6} value={aikotoba.encode(sdp || '')} readOnly />
            </div>
          </>
        )
      }

      {
        // return key
        peer && sdp && connectionStep === 'offered' && (
          <>
            <div className="keyframe">
              <p className="keyname">リターンキー</p>

              <textarea
                rows={6}
                value={answerSDP}
                onChange={(e) => setAnswerSDP(e.target.value)}
              />
              <Button onClick={handleAnser} disabled={!answerSDP}>
                入力する
              </Button>
            </div>
          </>
        )
      }

      <style jsx>{`
        .keyframe {
          margin: 1em 0;
          padding: 1em;
          width: 100%;
          max-width: 600px;
          border: 1px solid #bbb;
          border-radius: 6px;
          word-break: break-all;
        }

        .keyname {
          margin: 0 0 1em;
          padding: 0;
        }

        textarea {
          width: 100%;
        }
      `}</style>
    </>
  );
};
