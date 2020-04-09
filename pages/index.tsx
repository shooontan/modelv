import React from 'react';
import Link from 'next/link';
import { Video } from '../components/Vtuber';

function Home() {
  return (
    <div>
      <p>
        <Link href="/mmd">
          <a>mmd</a>
        </Link>
      </p>
      <Video />
    </div>
  );
}

export default Home;
