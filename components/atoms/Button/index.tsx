import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <>
      <button {...props} />
      <style jsx>{`
        button {
          display: inline-block;
          margin: 0;
          padding: 10px 30px;
          background: #fff;
          border: 1px solid #bbb;
          border-radius: 6px;
          color: #555;
          cursor: pointer;
          font-weight: 600;
          line-height: 1.6;
          text-decoration: none;
          transition: 0.3s;
        }

        button:hover {
          background: #eee;
        }
      `}</style>
    </>
  );
};
