import React from 'react';
import { HeadPose } from '@/context';
import { EulerAngleItem } from '@/components/atoms/EulerAngleItem';

export type EulerAnglePanelProps = {};

function numlad(angle: number) {
  return Math.round(angle).toString().padStart(4, ' ');
}

export const EulerAnglePanel: React.FC<EulerAnglePanelProps> = () => {
  const [angles] = HeadPose.EulerAngles.useContainer();

  return (
    <>
      <div>
        <EulerAngleItem type="yaw">
          {angles?.yaw && numlad(angles.yaw)}
        </EulerAngleItem>
        <EulerAngleItem type="pitch">
          {angles?.pitch && numlad(angles.pitch)}
        </EulerAngleItem>
        <EulerAngleItem type="roll">
          {angles?.roll && numlad(angles.roll)}
        </EulerAngleItem>
      </div>
      <style jsx>{`
        div {
          max-width: 400px;
        }
      `}</style>
    </>
  );
};
