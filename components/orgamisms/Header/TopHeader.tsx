import React from 'react';

export const TopHeader: React.FC = () => {
  return (
    <>
      <header>
        <div>
          <h1>ModelV.</h1>
          <p>webカメラとブラウザでバーチャルモデルに。</p>
        </div>
      </header>
      <style jsx>{`
        header {
          position: relative;
          width: 100%;
          height: 60px;
        }

        header:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20px;
          width: 580px;
          height: 2px;
          background: #333;
          opacity: 0.7;
        }

        h1 {
          margin: 0;
          padding: 0 20px;
        }

        p {
          margin: 0;
        }

        div {
          display: flex;
          align-items: center;
          height: 100%;
          font-size: 20px;
        }
      `}</style>
    </>
  );
};
