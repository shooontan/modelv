import React from 'react';
import Head from 'next/head';
import {
  AppPropsType,
  AppContextType,
  NextComponentType,
} from 'next/dist/next-server/lib/utils';
import { Providers, HeadPose, Landmark, Model } from '@/context';
import { Seo } from '@/components/atoms/Seo';

type AppProps = {};

const App: NextComponentType<AppContextType, AppProps, AppPropsType> = ({
  Component,
  pageProps,
}) => {
  return (
    <>
      <Seo
        title={process.env.APP_TITLE + ' | ' + process.env.APP_DESCRIPTION}
        ogImage={process.env.APP_URL + 'media/ogp.gif'}
      />
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=no"
        />
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
          <Model.BackgroundColor.Provider key="backgroundcolor">
            {}
          </Model.BackgroundColor.Provider>,
        ]}
      >
        <Component {...pageProps} />
      </Providers>
      <style jsx global>{`
        body {
          font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN',
            'Hiragino Sans', Meiryo, sans-serif;
          letter-spacing: 1.2px;
          overflow-y: scroll;
        }
      `}</style>
    </>
  );
};

export default App;
