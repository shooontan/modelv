import React from 'react';

export const Arrow: React.FC = () => {
  return (
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
      >
        <g>
          <polygon
            className="st0"
            points="163.916,0 92.084,71.822 276.258,255.996 92.084,440.178 163.916,512 419.916,255.996 	"
          />
        </g>
      </svg>
      <style jsx>{`
        svg {
          width: 16px;
          height: 16px;
          opacity: 1;
        }

        polygon {
          fill: rgb(75, 75, 75);
        }
      `}</style>
    </>
  );
};
