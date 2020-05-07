import React from 'react';
import { HeadPose, Landmark } from '@/context';
import { aikotoba } from '@/libs/aikotoba';
import { usePeerConnection } from '@/components/hooks/usePeer';
import { Button } from '@/components/atoms/Button';
import { DataFormat } from './types';

type ConnectionStep = 'idle' | 'offered' | 'connectiong' | 'error';

export const OfferPeerConnection = () => {
  const [eulerAngles] = HeadPose.EulerAngles.useContainer();
  const [points] = Landmark.Points.useContainer();
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
        points,
      };

      try {
        dataChannel.send(JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [dataChannel, eulerAngles, points]);

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
   * copy sdp
   */
  const handleSDPCopy = React.useCallback(() => {
    const listner = (e: ClipboardEvent) => {
      e.clipboardData?.setData('text/plain', aikotoba.encode(sdp || ''));
      e.preventDefault();
    };
    document.addEventListener('copy', listner);
    document.execCommand('copy');
    document.removeEventListener('copy', listner);
  }, [sdp]);

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
      <p className="status">ステータス: {displayStatus}</p>
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
              <Button onClick={handleSDPCopy}>コピーする</Button>
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
          margin: 0 0 4em 0;
          width: 100%;
          box-sizing: border-box;
          word-break: break-all;
        }

        .keyframe:last-child {
          margin: 0;
        }

        .keyname {
          margin: 0 0 0.5em;
          padding: 0;
        }

        textarea {
          width: 100%;
          resize: vertical;
          margin: 0 0 0.5em;
          padding: 1em 0.5em 1em 1em;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
};
