import React from 'react';
import { HeadPose, Landmark, Model } from '@/context';
import { aikotoba } from '@/libs/aikotoba';
import { usePeerConnection } from '@/components/hooks/usePeer';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { DataFormat } from './types';

export const OfferPeerConnection = () => {
  const [eulerAngles] = HeadPose.EulerAngles.useContainer();
  const [points] = Landmark.Points.useContainer();
  const [bgColor] = Model.BackgroundColor.useContainer();

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
    if (dataChannel?.readyState !== 'open') {
      return;
    }

    const data: DataFormat = {
      eulerAngles,
      points,
      backgroundColor: bgColor,
    };
    try {
      dataChannel.send(JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }, [dataChannel, eulerAngles, points, bgColor]);

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
  if (!sdp) {
    displayStatus = '未接続';
  } else if (typeof connectionState === 'undefined') {
    displayStatus = '接続待ち';
  } else if (connectionState === 'connecting') {
    displayStatus = '接続待ち';
  } else if (connectionState === 'connected') {
    displayStatus = '接続中';
  } else if (connectionState === 'closed') {
    displayStatus = '切断済み';
  }

  const showKeyFrame =
    peer &&
    sdp &&
    (connectionState === undefined || connectionState === 'connecting');

  return (
    <>
      <div className="statusframe">
        <p className="status">
          ステータス: <Icon.Connection status={connectionState} />
          {displayStatus}
        </p>
      </div>
      {
        // generate buttton
        !peer && connectionState !== 'disconnected' && (
          <Button
            onClick={async () => {
              try {
                await createOffer();
              } catch (error) {
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
        showKeyFrame && (
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
        showKeyFrame && (
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
        .statusframe {
          margin: 0 0 1.5em;
        }

        .status {
          margin: 0;
        }

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
