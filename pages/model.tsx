import React from 'react';
import dynamic from 'next/dynamic';
import { AnswerPeerConnection } from '@/components/services/PeerConnection/AnswerPeerConnection';
import { Seo } from '@/components/atoms/Seo';

const DynamicMMD = dynamic(() => import('@/components/MMD'), {
  ssr: false,
});

function Home() {
  return (
    <>
      <Seo
        title={'モデル - ' + process.env.APP_TITLE}
        canonical={process.env.APP_URL + 'model'}
      />
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

        body {
          overflow-y: hidden !important;
        }
      `}</style>
    </>
  );
}

export default Home;
