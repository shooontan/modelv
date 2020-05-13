import React from 'react';
import { CameraVideo } from './CameraVideo';
import { Button } from '@/components/atoms/Button';

type CameraStatus = 'active' | 'inactive' | 'blocked';

export const CameraPanel = () => {
  const [cameraStatus, setCameraStatus] = React.useState<CameraStatus>(
    'inactive'
  );

  return (
    <>
      <CameraVideo active={cameraStatus === 'active'} />

      <div className="cbutton">
        <Button
          disabled={cameraStatus === 'blocked'}
          onClick={() => {
            if (cameraStatus === 'inactive') {
              setCameraStatus('active');
            } else if (cameraStatus === 'active') {
              setCameraStatus('inactive');
            }
          }}
        >
          {cameraStatus === 'active' && 'カメラ停止'}
          {cameraStatus === 'inactive' && 'カメラ起動'}
          {cameraStatus === 'blocked' && 'カメラ起動'}
        </Button>
      </div>

      <style jsx>{`
        .cbutton {
          margin: 0 0 20px;
          padding: 20px 0;
          width: 100%;
          text-align: center;
        }
      `}</style>
    </>
  );
};
