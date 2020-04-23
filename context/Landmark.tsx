import React from 'react';
import { createContainer } from 'unstated-next';

type Point = [number, number];

type Points = {
  nose?: Point;
  leftEye?: Point;
  rightEye?: Point;
  leftMouth?: Point;
  rightMouth?: Point;
  jaw?: Point;
};

const usePoints = () => React.useState<Points>({});

const Points = createContainer(usePoints);

export const Landmark = {
  Points,
};
