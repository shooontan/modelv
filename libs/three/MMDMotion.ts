import * as THREE from 'three';
import { RootState } from '@/modules';
import { KalmanFilter } from '@/libs/KalmanFilter';

const kfilter = {
  body: new KalmanFilter({ d: 3, R: 0.01, Q: 3 }),
};

type Bone = {
  name: string;
  translation: [number, number, number];
  quaternion: [number, number, number, number];
};

type VPD = {
  bones: Bone[];
};

type VPDBuilderOption = {
  eulerAngles: NonNullable<RootState['headpose']['eulerAngles']>;
  points: RootState['landmark']['points'];
};

export class MMDMotion {
  private reversePitch: boolean = false;
  private eulerAngles: VPDBuilderOption['eulerAngles'];
  private points: VPDBuilderOption['points'];

  private vpd: VPD = {
    bones: [],
  };

  constructor(opts: VPDBuilderOption) {
    this.reversePitch = opts.eulerAngles.pitch < 0;
    this.eulerAngles = {
      pitch: 180 - Math.abs(opts.eulerAngles.pitch),
      roll: opts.eulerAngles.roll,
      yaw: opts.eulerAngles.yaw,
    };

    this.points = opts.points;
  }

  buildVPD() {
    if (!this.eulerAngles) {
      return {
        bones: [],
      };
    }

    const x = (this.eulerAngles.pitch / 180) * 4 * (this.reversePitch ? 1 : -1);
    const y = this.eulerAngles.yaw / 90;
    const z = this.eulerAngles.roll / 90;

    // bone: HEAD
    const quaternionHead = new THREE.Quaternion();
    quaternionHead.setFromEuler(new THREE.Euler(x, y, z, 'XYZ'));
    this.addBone('頭', [
      quaternionHead.x,
      quaternionHead.y,
      quaternionHead.z,
      quaternionHead.w,
    ]);

    // bone: BODY
    const bodyEuler = kfilter.body.filter([x, y, z]);
    const quaternionBody = new THREE.Quaternion();
    quaternionBody.setFromEuler(
      new THREE.Euler(
        bodyEuler[0] / 6,
        bodyEuler[1] / 6,
        bodyEuler[2] / 6,
        'XYZ'
      )
    );
    this.addBone('上半身', [
      quaternionBody.x,
      quaternionBody.y,
      quaternionBody.z,
      quaternionBody.w,
    ]);

    // bone: LEFT ARM
    const quaternionLeftArm = new THREE.Quaternion();
    quaternionLeftArm.setFromEuler(new THREE.Euler(0.1, -0.3, -0.5, 'XYZ'));
    this.addBone('左腕', [
      quaternionLeftArm.x,
      quaternionLeftArm.y,
      quaternionLeftArm.z,
      quaternionLeftArm.w,
    ]);

    // bone: RIGHT ARM
    const quaternionRightArm = new THREE.Quaternion();
    quaternionRightArm.setFromEuler(new THREE.Euler(0.1, -0.3, 0.5, 'XYZ'));
    this.addBone('右腕', [
      quaternionRightArm.x,
      quaternionRightArm.y,
      quaternionRightArm.z,
      quaternionRightArm.w,
    ]);

    return this.vpd;
  }

  addBone(name: string, quaternion: Bone['quaternion']) {
    this.vpd.bones.push({
      name,
      translation: [0, 0, 0],
      quaternion,
    });
  }

  morph(mesh: THREE.SkinnedMesh) {
    const { upperLip, lowerLip, leftMouth, rightMouth } = this.points;
    if (!upperLip || !lowerLip || !leftMouth || !rightMouth) {
      return;
    }
    if (!mesh.morphTargetInfluences) {
      return;
    }

    // morph: あ
    const dicAIndex = mesh.morphTargetDictionary?.['あ'];
    if (typeof dicAIndex === 'number') {
      const disth = Math.sqrt(
        (leftMouth[0] - rightMouth[0]) ** 2 +
          (leftMouth[1] - rightMouth[1]) ** 2
      );
      const distv = Math.sqrt(
        (upperLip[0] - lowerLip[0]) ** 2 + (upperLip[1] - lowerLip[1]) ** 2
      );
      mesh.morphTargetInfluences[dicAIndex] = Math.min(distv / disth, 1);
    }
  }
}
