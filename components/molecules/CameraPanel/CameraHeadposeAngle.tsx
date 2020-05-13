import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/modules';

type CameraHeadposeAngleProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const CameraHeadposeAngle: React.FC<CameraHeadposeAngleProps> = (
  props
) => {
  const points = useSelector<RootState, RootState['headpose']['projectPoints']>(
    (state) => state.headpose.projectPoints
  );

  React.useEffect(
    () => {
      const canvas = props.canvasRef.current;
      if (!canvas || !points) {
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = 'rgb(255, 0, 0)';
      context.moveTo(points.nose.x, points.nose.y);
      context.lineTo(points.z.x, points.z.y);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = 'rgb(0, 0, 255)';
      context.moveTo(points.nose.x, points.nose.y);
      context.lineTo(points.x.x, points.x.y);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = 'rgb(0, 255, 0)';
      context.moveTo(points.nose.x, points.nose.y);
      context.lineTo(points.y.x, points.y.y);
      context.stroke();
      context.closePath();
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [points]
  );

  return <>{props.children}</>;
};
