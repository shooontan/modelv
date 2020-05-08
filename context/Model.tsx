import React from 'react';
import { createContainer } from 'unstated-next';

const useBackgroundColor = () => React.useState(0xffffff);

const BackgroundColor = createContainer(useBackgroundColor);

export const Model = {
  BackgroundColor,
};
