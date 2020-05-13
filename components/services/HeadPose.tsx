import React from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, headpose } from '@/modules';
import { AppDispatch } from '@/store';
import { OPCV as Opcv } from '@/libs/opencv/getEulerAngle';

let OPCV: Opcv | null = null;

export const HeadPose: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const points = useSelector<RootState, RootState['landmark']['points']>(
    (state) => state.landmark.points
  );

  /**
   * clear OPCV
   */
  React.useEffect(() => {
    return () => {
      if (OPCV) {
        OPCV.delete();
        OPCV = null;
      }
    };
  }, []);

  /**
   * estimate headpose
   */
  React.useEffect(
    () => {
      if (!window.cv || !window.cv.Mat) {
        return;
      }

      if (!OPCV) {
        OPCV = new Opcv();
      } else {
        const { eulerAngles, projectPoints } = OPCV.estimateEulerAngles(points);
        // update estimated info
        if (eulerAngles && projectPoints) {
          dispatch(
            headpose.actions.update({
              eulerAngles,
              projectPoints,
            })
          );
        }
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [points]
  );

  const loadedOpenCV = typeof window !== 'undefined' && window.cv;

  return (
    <>
      {
        // load once.
        !loadedOpenCV && (
          <Head>
            <script src="/js/opencv.js" type="text/javascript" />
          </Head>
        )
      }
    </>
  );
};

export default HeadPose;
