import React from 'react';
import Link from 'next/link';

export const HeroHeader: React.FC = () => {
  return (
    <>
      <div className="hero">
        <HeroVideo />
        <PageLink />
      </div>

      <style jsx>{`
        .hero {
          padding: 60px 0;
          background: radial-gradient(70% 70% at 50% 100%, #eee 0, #fff 100%);
        }
      `}</style>
    </>
  );
};

const HeroVideo: React.FC = () => {
  const [wstate, setWState] = React.useState<boolean>();
  const [bstate, setBState] = React.useState<boolean>();
  const wVideoRef = React.useRef<HTMLVideoElement>(null);
  const bVideoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    wVideoRef.current?.load();
    bVideoRef.current?.load();
  }, []);

  React.useEffect(() => {
    if (wstate === undefined || bstate === undefined) {
      return;
    }
    if (wstate === bstate) {
      wVideoRef.current?.play();
      bVideoRef.current?.play();
    }
  }, [wstate, bstate]);

  return (
    <>
      <div className="videos">
        <div className="video cpanel">
          <img src="/imgs/header-w.png" alt="" />
          <video
            src="/movies/face.mp4"
            muted
            playsInline
            ref={wVideoRef}
            onEnded={() => setWState(!wstate)}
            onCanPlay={() => typeof wstate !== 'boolean' && setWState(true)}
          />
        </div>
        <div className="video model">
          <img src="/imgs/header-b.png" alt="" />
          <video
            src="/movies/model.mp4"
            muted
            playsInline
            ref={bVideoRef}
            onEnded={() => setBState(!bstate)}
            onCanPlay={() => typeof bstate !== 'boolean' && setBState(true)}
          />
        </div>
      </div>
      <style jsx>{`
        .videos {
          display: flex;
          justify-content: space-between;
          margin: 0 auto 40px auto;
          width: 100%;
          max-width: 800px;
        }

        .video {
          display: flex;
          flex-direction: column;
          width: 300px;
          background: #fefefe;
          border-radius: 6px;
          box-shadow: 0px 0px 9px 2px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .video img {
          width: 100%;
        }

        .videos video {
          width: 300px;
        }
      `}</style>
    </>
  );
};

const PageLink: React.FC = () => {
  return (
    <>
      <div className="links">
        <div className="item">
          <p className="link">
            <Link href="/cpanel">
              <a>操作パネル</a>
            </Link>
          </p>
        </div>
        <div className="item">
          <p className="link">
            <Link href="/model">
              <a>モデル</a>
            </Link>
          </p>
        </div>
      </div>
      <style jsx>{`
        .links {
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          width: 100%;
          max-width: 800px;
        }

        .item {
          padding: 0 70px;
          width: 300px;
          height: 80px;
          box-sizing: border-box;
        }

        .link {
          margin: 0;
          width: 100%;
          height: 100%;
        }

        .link a {
          display: flex;
          margin: 0;
          width: 100%;
          height: 100%;
          text-decoration: none;
          justify-content: center;
          align-items: center;
          background: #333;
          border: 2px solid #333;
          border-radius: 6px;
          color: #fafafa;
          font-weight: bold;
          transition: 0.3s;
        }

        .link a:hover {
          background: #fafafa;
          color: #333;
        }
      `}</style>
    </>
  );
};
