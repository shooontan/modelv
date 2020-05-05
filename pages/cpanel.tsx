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
      <Camera />
      <div>
        <EulerAnglePanel />
        <OfferPeerConnection />
      </div>
      <style jsx>{`
        div {
          margin: 0 auto;
          width: 100%;
          max-width: 800px;
        }
      `}</style>
    </>
  );
}

export default Home;
