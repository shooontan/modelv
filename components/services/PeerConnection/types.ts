import { Points } from '@/modules/landmark';

export type DataFormat = {
  eulerAngles?: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  points?: Points;
  backgroundColor?: number;
};
