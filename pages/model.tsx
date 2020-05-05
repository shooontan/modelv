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
      <style jsx global>{`
        html,
        body,
        #__next {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default Home;
