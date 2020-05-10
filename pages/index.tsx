import React from 'react';
import { TopHeader } from '@/components/orgamisms/Header/TopHeader';
import { HeroHeader } from '@/components/orgamisms/Header/HeroHeader';
import { TopMain } from '@/components/orgamisms/Main/TopMain';
import { AppFooter } from '@/components/orgamisms/Footer/AppFooter';
import { Seo } from '@/components/atoms/Seo';

const Home: React.FC = () => {
  return (
    <>
      <Seo canonical={process.env.APP_URL} />
      <TopHeader />
      <HeroHeader />
      <TopMain />
      <AppFooter />
    </>
  );
};

export default Home;
