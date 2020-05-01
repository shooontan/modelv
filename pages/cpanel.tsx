import React from 'react';
import dynamic from 'next/dynamic';
import { Camera } from '@/components/Camera';
import { OfferPeerConnection } from '@/components/PeerConnection/OfferPeerConnection';

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
      <OfferPeerConnection />
    </>
  );
}

export default Home;
