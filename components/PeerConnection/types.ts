import { Points } from '@/context/Landmark';

export type DataFormat = {
  eulerAngles?: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  points?: Points;
  backgroundColor?: number;
};
