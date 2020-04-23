import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Camera } from '../components/Camera';
import { Providers } from '../context';
import { Landmark } from '../context/Landmark';
import { HeadPose } from '../context/HeadPose';

const DynamicOpenCV = dynamic(() => import('../components/OpenCV'), {
  ssr: false,
});

const DynamicMMD = dynamic(() => import('../components/MMD'), {
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
        <div>
          <p>
            <Link href="/mmd">
              <a>mmd</a>
            </Link>
            {'  '}
            <Link href="/opencv">
              <a>opencv</a>
            </Link>
          </p>
          <Camera />
        </div>

        <DynamicOpenCV />
        <DynamicMMD />
      </Providers>
    </>
  );
}

export default Home;
