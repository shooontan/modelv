import React from 'react';

export const AppFooter = () => {
  return (
    <>
      <footer>
        <div className="frame">
          <span>&copy; 2020 ModelV.</span>
        </div>
      </footer>
      <style jsx>{`
        footer {
          padding: 20px 0;
          width: 100%;
          background: #000;
          border-top: 1px solid #cecece;
          color: #fafafa;
        }

        .frame {
          margin: 0 auto;
          width: 100%;
          max-width: 800px;
          box-sizing: border-box;
        }

        span {
          font-size: 14px;
        }

        @media (max-width: 879px) {
          .frame {
            padding: 0 1em;
          }
        }
      `}</style>
    </>
  );
};
