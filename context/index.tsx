import React from 'react';
import { HeadPose } from '@/context/HeadPose';
import { Landmark } from '@/context/Landmark';

export { HeadPose, Landmark };

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
