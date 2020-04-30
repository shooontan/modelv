import React from 'react';
import dynamic from 'next/dynamic';
import { AnswerPeerConnection } from '@/components/PeerConnection/AnswerPeerConnection';

const DynamicMMD = dynamic(() => import('@/components/MMD'), {
  ssr: false,
});

function Home() {
  return (
    <>
      <DynamicMMD />
      <AnswerPeerConnection />
    </>
  );
}

export default Home;
