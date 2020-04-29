import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Providers } from '@/context';
import { Landmark } from '@/context/Landmark';
import { HeadPose } from '@/context/HeadPose';
import { AnswerPeerConnection } from '@/components/PeerConnection/AnswerPeerConnection';

const DynamicMMD = dynamic(() => import('@/components/MMD'), {
  ssr: false,
});

function Home() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU="
          crossOrigin="anonymous"
        />
      </Head>
      <Providers
        providers={[
          <Landmark.Points.Provider key="points">{}</Landmark.Points.Provider>,
          <HeadPose.RotationVec.Provider key="rotation">
            {}
          </HeadPose.RotationVec.Provider>,
          <HeadPose.TranslationVec.Provider key="translation">
            {}
          </HeadPose.TranslationVec.Provider>,
          <HeadPose.EulerAngles.Provider key="eulerangles">
            {}
          </HeadPose.EulerAngles.Provider>,
        ]}
      >
        <DynamicMMD />
        <AnswerPeerConnection />
      </Providers>
    </>
  );
}

export default Home;
