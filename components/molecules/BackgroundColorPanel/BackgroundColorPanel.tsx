import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { model } from '@/modules/model';

type Color = {
  id: string;
  name: string;
  hex: number;
};

const colors: Color[] = [
  {
    id: 'white',
    name: 'ホワイト',
    hex: 0xffffff,
  },
  {
    id: 'green',
    name: 'グリーン',
    hex: 0x00ff00,
  },
  {
    id: 'blue',
    name: 'ブルー',
    hex: 0x0000ff,
  },
  {
    id: 'magenta',
    name: 'マゼンタ',
    hex: 0xff00ff,
  },
];

export type EulerAnglePanelProps = {};

export const BackgroundColorPanel: React.FC<EulerAnglePanelProps> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const buttons = colors.map((color) => {
    return (
      <React.Fragment key={color.id}>
        <button
          onClick={() =>
            dispatch(model.actions.updateBackgroundColor(color.hex))
          }
        >
          {color.name}
        </button>
        <style jsx>{`
          button {
            display: inline-block;
            margin: 0 0.5em 0.5em;
            padding: 10px 20px;
            width: 110px;
            background: #fafafa;
            border: 2px solid transparent;
            border-radius: 6px;
            color: #333;
            cursor: pointer;
            font-weight: 600;
            line-height: 1.6;
            text-decoration: none;
            transition: 0.3s;
          }

          button:hover {
            background: #fafafa;
            color: #333;
            border: 2px solid #333;
          }
        `}</style>
      </React.Fragment>
    );
  });

  return (
    <>
      <div>
        <p className="colortitle">背景色</p>
        <div className="colorbtns">{buttons}</div>
      </div>
      <style jsx>{`
        .colortitle {
          margin: 0 0 1em;
        }

        .colorbtns {
          display: flex;
          margin: 0 auto;
          width: 100%;
          max-width: 520px;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
};
