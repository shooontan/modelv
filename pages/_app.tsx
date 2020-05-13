import React from 'react';
import Head from 'next/head';
import {
  AppPropsType,
  AppContextType,
  NextComponentType,
} from 'next/dist/next-server/lib/utils';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Seo } from '@/components/atoms/Seo';
import { GAnalytics } from '@/components/services/GAnalytics';

type AppProps = {};

const App: NextComponentType<AppContextType, AppProps, AppPropsType> = ({
  Component,
  pageProps,
}) => {
  return (
    <>
      <Provider store={store}>
        <Seo
          title={process.env.APP_TITLE + ' | ' + process.env.APP_DESCRIPTION}
          ogTitle={process.env.APP_TITLE}
          ogDescription={process.env.APP_DESCRIPTION}
          ogImage={process.env.APP_URL + 'media/ogp.gif'}
          twitterCard="summary"
          twitterTitle={process.env.APP_TITLE}
          twitterDescription={process.env.APP_DESCRIPTION}
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
        <GAnalytics
          measurementId={process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID}
        />
        <Component {...pageProps} />
        <style jsx global>{`
          body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN',
              'Hiragino Sans', Meiryo, sans-serif;
            letter-spacing: 1.2px;
            overflow-y: scroll;
          }
        `}</style>
      </Provider>
    </>
  );
};

export default App;
