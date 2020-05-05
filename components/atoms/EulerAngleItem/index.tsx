import React from 'react';

export type EulerAngleItemProps = React.HTMLAttributes<HTMLSpanElement> & {
  type: 'yaw' | 'pitch' | 'roll';
};

const colors = {
  yaw: 'green',
  pitch: 'blue',
  roll: 'red',
} as const;

export const EulerAngleItem: React.FC<EulerAngleItemProps> = (props) => {
  const { type, ...rest } = props;
  const color = colors[type];
  return (
    <>
      <p>
        <span {...rest}>{props.type + ': '}</span>
        {props.children}
      </p>
      <style jsx>{`
        p {
          display: inline-block;
          width: 33%;
        }

        span {
          color: ${color};
        }
      `}</style>
    </>
  );
};
