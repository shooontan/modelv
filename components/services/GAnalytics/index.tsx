import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type GAnalyticsProps = {
  measurementId: string;
};

export const GAnalytics: React.FC<GAnalyticsProps> = (props) => {
  const id = props.measurementId;
  const code = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');`;

  const router = useRouter();

  React.useEffect(() => {
    window.gtag('config', id, {
      page_path: router.asPath,
    });
  }, [router.asPath, id]);

  return (
    <Head>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script dangerouslySetInnerHTML={{ __html: code }} />
    </Head>
  );
};
