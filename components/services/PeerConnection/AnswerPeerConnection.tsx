import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { landmark, headpose, model } from '@/modules';
import { aikotoba } from '@/libs/aikotoba';
import { usePeerConnection } from '@/components/hooks/usePeer';
import { Button } from '@/components/atoms/Button';
import { DataFormat } from './types';

export const AnswerPeerConnection = () => {
  const dispatch = useDispatch<AppDispatch>();

  // for connection
  const [offerSDP, setOfferSDP] = React.useState('');
  const {
    peer,
    dataChannel,
    createAnser,
    sdp,
    // refresh,
    connectionState,
  } = usePeerConnection();

  /**
   * recieve data
   */
  React.useEffect(
    () => {
      if (!dataChannel) {
        return;
      }
      dataChannel.onmessage = (e) => {
        const data = JSON.parse(e.data) as DataFormat;
        data.eulerAngles &&
          dispatch(headpose.actions.updateEulerAngles(data.eulerAngles));
        data.points && dispatch(landmark.actions.updatePoints(data.points));
        typeof data.backgroundColor === 'number' &&
          dispatch(model.actions.updateBackgroundColor(data.backgroundColor));
      };
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [dataChannel]
  );

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

  if (connectionState && connectionState !== 'connecting') {
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
                <textarea
                  rows={6}
                  value={aikotoba.encode(sdp || '')}
                  readOnly
                />
                <Button onClick={handleSDPCopy}>コピーする</Button>
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
          max-width: 400px;
          background: rgba(255, 255, 255, 0.9);
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
          resize: vertical;
        }
      `}</style>
    </>
  );
};
