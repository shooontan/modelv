import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicArrowIcon = dynamic(
  // @ts-ignore
  () => import('@/components/atoms/Icon/Arrow').then((mod) => mod.Arrow),
  {
    ssr: false,
  }
);

export const HeroHeader: React.FC = () => {
  return (
    <>
      <div className="hero">
        <HeroVideo />
        <PageLink />
      </div>

      <style jsx>{`
        .hero {
          padding: 60px 20px;
          background: radial-gradient(70% 70% at 50% 100%, #eee 0, #fff 100%);
          box-sizing: border-box;
        }

        @media (max-width: 879px) {
          .hero {
            margin: 0 auto;
            width: 100%;
            max-width: 680px;
          }
        }

        @media (max-width: 419px) {
          .hero {
            padding: 30px 20px;
          }
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
        <ArrowAnimation />
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

        @media (max-width: 879px) {
          .videos {
            display: block;
            text-align: center;
          }

          .video.model {
            margin: 0 0 0 auto;
          }
        }

        @media (max-width: 419px) {
          .video {
            width: 80%;
            height: auto;
          }

          .video video {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

const ArrowAnimation = () => {
  const Items = Array.from({ length: 5 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <DynamicArrowIcon />
      <style jsx>{`
        :global(svg) {
          animation: anime 2.5s infinite both;
        }

        :global(svg):nth-child(5n + 1) {
          animation-delay: 0s;
        }

        :global(svg):nth-child(5n + 2) {
          animation-delay: 0.5s;
        }
        :global(svg):nth-child(5n + 3) {
          animation-delay: 1s;
        }

        :global(svg):nth-child(5n + 4) {
          animation-delay: 1.5s;
        }

        :global(svg):nth-child(5n) {
          animation-delay: 2s;
        }

        @keyframes anime {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @media (max-width: 879px) {
          :global(svg) {
            display: none;
          }
        }
      `}</style>
    </React.Fragment>
  ));

  return (
    <>
      <div>{Items}</div>
      <style jsx>{`
        div {
          display: flex;
          margin: 0;
          padding: 24px 0 0;
          width: 100px;
          justify-content: center;
          align-items: center;
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

        @media (max-width: 879px) {
          .links {
            justify-content: space-around;
          }

          .item {
            padding: 0;
            width: 150px;
            height: 40px;
          }
        }

        @media (max-width: 419px) {
          .links {
            display: block;
          }

          .item {
            margin: 0 auto 20px;
          }

          .item:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </>
  );
};
