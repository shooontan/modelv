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
          background: #333;
          border: 2px solid transparent;
          border-radius: 6px;
          color: #fafafa;
          cursor: pointer;
          font-weight: 600;
          line-height: 1.6;
          text-decoration: none;
          transition: 0.3s;
        }

        button:hover {
          background: #fafafa;
          color: #333;
          border: 2px solid #333;
        }
      `}</style>
    </>
  );
};
