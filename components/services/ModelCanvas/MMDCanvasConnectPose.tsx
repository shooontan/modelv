import React, { useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { RootState } from '@/modules';
import { MMDMotion } from '@/libs/three/MMDMotion';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';

type SelectState = {
  eulerAngles: RootState['headpose']['eulerAngles'];
  points: RootState['landmark']['points'];
  bgColor: RootState['model']['backgroundColor'];
};

type MMDCanvasConnectionProps = {
  mesh?: THREE.SkinnedMesh;
  helper?: MMDAnimationHelper;
  scene?: THREE.Scene;
};

type MMDCanvasConnectionT = {
  setPose: () => void;
};

const MMDCanvasConnection: React.ForwardRefRenderFunction<
  MMDCanvasConnectionT,
  MMDCanvasConnectionProps
> = (props, ref) => {
  const { mesh, helper, scene } = props;

  const selectState = useSelector<RootState, SelectState>((state) => ({
    eulerAngles: state.headpose.eulerAngles,
    points: state.landmark.points,
    bgColor: state.model.backgroundColor,
  }));

  useImperativeHandle(ref, () => ({
    setPose: () => {
      const { eulerAngles, points } = selectState;
      if (!eulerAngles || !mesh || !helper) {
        return;
      }
      const mmdMotion = new MMDMotion({
        eulerAngles,
        points,
      });
      // vpd
      const vpd = mmdMotion.buildVPD();
      // morph
      mmdMotion.morph(mesh);
      // update pose
      helper.pose(mesh, vpd);

      // update canvas background color
      if (scene) {
        scene.background = new THREE.Color(selectState.bgColor);
      }
    },
  }));

  return null;
};

export const MMDCanvasConnectPose = React.forwardRef(MMDCanvasConnection);
