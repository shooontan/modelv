import React from 'react';
import { createContainer } from 'unstated-next';

type Angles = {
  pitch: number;
  yaw: number;
  roll: number;
};

const useRotationVec = () => React.useState<Float64Array>();
const useTranslationVec = () => React.useState<Float64Array>();
const useEulerAngles = () => React.useState<Angles>();

const RotationVec = createContainer(useRotationVec);
const TranslationVec = createContainer(useTranslationVec);
const EulerAngles = createContainer(useEulerAngles);

export const HeadPose = {
  RotationVec,
  TranslationVec,
  EulerAngles,
};
