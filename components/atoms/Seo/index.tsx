import React from 'react';
import Head from 'next/head';

type SeoProps = {
  title?: string;
  ogSiteName?: string;
  ogTitle?: string;
  ogUrl?: string;
  ogImage?: string;
  ogDescription?: string;
  canonical?: string;
};

export const Seo: React.FC<SeoProps> = (props) => {
  return (
    <Head>
      {props.title && <title>{props.title}</title>}
      {props.ogSiteName && (
        <meta property="og:site_name" content={props.ogSiteName} />
      )}
      {props.ogTitle && <meta property="og:title" content={props.ogTitle} />}
      {props.ogUrl && <meta property="og:url" content={props.ogUrl} />}
      {props.ogImage && <meta property="og:image" content={props.ogImage} />}
      {props.ogDescription && (
        <meta property="og:description" content={props.ogDescription} />
      )}
      {props.canonical && <link rel="canonical" href={props.canonical} />}
    </Head>
  );
};
