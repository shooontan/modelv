import React from 'react';
import { TopHeader } from '@/components/orgamisms/Header/TopHeader';
import { HeroHeader } from '@/components/orgamisms/Header/HeroHeader';
import { TopMain } from '@/components/orgamisms/Main/TopMain';

const Home: React.FC = () => {
  return (
    <>
      <TopHeader />
      <HeroHeader />
      <TopMain />
    </>
  );
};

export default Home;
