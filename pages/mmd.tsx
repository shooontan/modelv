import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicMMD = dynamic(() => import('../components/MMD'), {
  ssr: false,
});

function Home() {
  return (
    <div>
      <p>
        <Link href="/">
          <a>top</a>
        </Link>
      </p>
      <DynamicMMD />
    </div>
  );
}

export default Home;
