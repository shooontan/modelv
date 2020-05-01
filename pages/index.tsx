import React from 'react';
import Link from 'next/link';

function Home() {
  return (
    <>
      <p>Model V</p>
      <div>
        <p>
          <Link href="/cpanel">
            <a>操作パネル</a>
          </Link>
        </p>
        <p>
          <Link href="/model">
            <a>モデル</a>
          </Link>
        </p>
      </div>
    </>
  );
}

export default Home;
