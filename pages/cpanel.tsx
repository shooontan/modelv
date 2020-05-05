import React from 'react';
import dynamic from 'next/dynamic';
import { Camera } from '@/components/Camera';
import { OfferPeerConnection } from '@/components/PeerConnection/OfferPeerConnection';
import { EulerAnglePanel } from '@/components/molecules/EulerAnglePanel';

const DynamicOpenCV = dynamic(() => import('@/components/OpenCV'), {
  ssr: false,
});

function Home() {
  return (
    <>
      <DynamicOpenCV />
      <div>
        <Camera />
      </div>
      <EulerAnglePanel />
      <OfferPeerConnection />
    </>
  );
}

export default Home;
