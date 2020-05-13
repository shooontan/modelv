import React from 'react';
import dynamic from 'next/dynamic';
import { CameraPanel } from '@/components/molecules/CameraPanel/CameraPanel';
import { OfferPeerConnection } from '@/components/services/PeerConnection/OfferPeerConnection';
// import { EulerAnglePanel } from '@/components/molecules/EulerAnglePanel';
import { ControlPanel } from '@/components/molecules/ControlPanel/ControlPanel';
import { BackgroundColorPanel } from '@/components/molecules/BackgroundColorPanel/BackgroundColorPanel';
import { AppFooter } from '@/components/orgamisms/Footer/AppFooter';
import { Seo } from '@/components/atoms/Seo';

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
      <Seo
        title={'操作パネル - ' + process.env.APP_TITLE}
        canonical={process.env.APP_URL + 'cpanel'}
      />
      <DynamicOpenCV />
      <CameraPanel />
      <ControlPanel lists={items}></ControlPanel>
      <AppFooter />
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
