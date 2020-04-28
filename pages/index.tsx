import React from 'react';
import dynamic from 'next/dynamic';
import { Camera } from '@/components/Camera';
import { Providers } from '@/context';
import { Landmark } from '@/context/Landmark';
import { HeadPose } from '@/context/HeadPose';
import { OfferPeerConnection } from '@/components/PeerConnection/OfferPeerConnection';

const DynamicOpenCV = dynamic(() => import('@/components/OpenCV'), {
  ssr: false,
});

function Home() {
  return (
    <>
      <Providers
        providers={[
          <Landmark.Points.Provider key="points">{}</Landmark.Points.Provider>,
          <HeadPose.RotationVec.Provider key="rotation">
            {}
          </HeadPose.RotationVec.Provider>,
          <HeadPose.TranslationVec.Provider key="translation">
            {}
          </HeadPose.TranslationVec.Provider>,
          <HeadPose.EulerAngles.Provider key="EulerAngles">
            {}
          </HeadPose.EulerAngles.Provider>,
        ]}
      >
        <DynamicOpenCV />
        <div>
          <Camera />
        </div>
        <OfferPeerConnection />
      </Providers>
    </>
  );
}

export default Home;
