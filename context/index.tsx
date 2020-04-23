import React from 'react';

export interface ProvidersProps {
  providers: React.ReactElement[];
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  return (
    <>
      {props.providers.reduce((child, Provider) => {
        return React.cloneElement(Provider, undefined, child);
      }, props.children)}
    </>
  );
};
