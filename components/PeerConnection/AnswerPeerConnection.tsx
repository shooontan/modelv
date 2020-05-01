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
    <>
      <div className="keymodal">
        {
          // connect key
          <>
            <div className="keyframe">
              <p className="keyname">コネクトキー</p>
              <textarea
                rows={6}
                value={offerSDP}
                onChange={(e) => setOfferSDP(e.target.value)}
              />
              <Button
                disabled={!offerSDP}
                onClick={() => {
                  try {
                    const decodeSDP = aikotoba.decode(offerSDP);
                    createAnser(decodeSDP);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                入力する
              </Button>
            </div>
          </>
        }

        {
          // return key
          peer && (
            <>
              <div className="keyframe">
                <p className="keyname">リターンキー</p>
                <p className="key">{aikotoba.encode(sdp || '')}</p>
              </div>
            </>
          )
        }
      </div>

      <style jsx>{`
        .keymodal {
          position: fixed;
          top: 0;
          left: 0;
        }

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

        .key {
          margin: 0;
        }

        textarea {
          width: 100%;
        }
      `}</style>
    </>
  );
};
