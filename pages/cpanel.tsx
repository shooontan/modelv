import React from 'react';
import dynamic from 'next/dynamic';
import { Camera } from '@/components/Camera';
import { OfferPeerConnection } from '@/components/PeerConnection/OfferPeerConnection';
// import { EulerAnglePanel } from '@/components/molecules/EulerAnglePanel';
import { ControlPanel } from '@/components/molecules/ControlPanel/ControlPanel';
import { BackgroundColorPanel } from '@/components/molecules/BackgroundColorPanel/BackgroundColorPanel';

const DynamicOpenCV = dynamic(() => import('@/components/OpenCV'), {
  ssr: false,
});

const Home = () => {
  const items = [
    {
      title: '接続',
      item: <OfferPeerConnection key="connection" />,
    },
    {
      title: 'モデル',
      item: (
        <>
          {/* <EulerAnglePanel key="model" /> */}
          <BackgroundColorPanel />
        </>
      ),
    },
  ];
  return (
    <>
      <DynamicOpenCV />
      <Camera />
      <ControlPanel lists={items}></ControlPanel>
      <style jsx>{`
        div {
          margin: 0 auto;
          width: 100%;
          max-width: 800px;
        }
      `}</style>
    </>
  );
};

export default Home;
