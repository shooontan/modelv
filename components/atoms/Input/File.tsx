import React from 'react';

export type FileProps = React.InputHTMLAttributes<HTMLInputElement>;

export const File: React.FC<FileProps> = (props) => {
  return (
    <>
      <input {...props} type="file" />
      <style jsx>{`
        input {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};
