import React from 'react';
import Head from 'next/head';
import {
  AppPropsType,
  AppContextType,
  NextComponentType,
} from 'next/dist/next-server/lib/utils';
import { Providers, HeadPose, Landmark } from '@/context';

type AppProps = {};

const App: NextComponentType<AppContextType, AppProps, AppPropsType> = ({
  Component,
  pageProps,
}) => {
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
        <Component {...pageProps} />
      </Providers>
      <style jsx global>{`
        body {
          overflow-y: scroll;
        }
      `}</style>
    </>
  );
};

export default App;
