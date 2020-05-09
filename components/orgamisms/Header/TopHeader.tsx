import React from 'react';

const Description = () => {
  return (
    <>
      <p>
        webカメラとブラウザで
        <br />
        バーチャルモデルに。
      </p>
      <style jsx>{`
        p {
          margin: 0;
        }

        @media (min-width: 560px) {
          br {
            display: none;
          }
        }

        @media (max-width: 879px) {
          p {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
};

export const TopHeader: React.FC = () => {
  return (
    <>
      <header>
        <div>
          <h1>ModelV.</h1>
          <Description />
        </div>
      </header>
      <style jsx>{`
        header {
          position: relative;
          width: 100%;
          height: 60px;
          background: #000;
          color: #fafafa;
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
          margin: 0 1em 0 0;
          font-family: 'Times New Roman';
        }

        p {
          margin: 0;
        }

        div {
          display: flex;
          align-items: center;
          padding: 0 20px;
          height: 100%;
          font-size: 20px;
        }

        @media (max-width: 879px) {
          header:after {
            bottom: 0;
            left: 0;
            width: 100%;
          }

          div {
            justify-content: space-between;
          }

          h1 {
            font-size: 28px;
          }

          p {
            font-size: 16px;
          }
        }

        @media (max-width: 379px) {
          div {
            padding: 0 1em;
          }

          h1 {
            margin-right: 10px;
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
};
