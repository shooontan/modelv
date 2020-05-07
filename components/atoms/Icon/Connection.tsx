import React from 'react';

const statusColor = {
  ready: {
    color: '#333',
  },
  new: {
    color: '#333',
  },
  connecting: {
    color: '#ffd753',
  },
  connected: {
    color: '#82de59',
  },
  disconnected: {
    color: '#e06565',
  },
  closed: {
    color: '#e06565',
  },
  failed: {
    color: '#e06565',
  },
};

type ConnectionProps = {
  status?: RTCPeerConnectionState;
};

export const Connection: React.FC<ConnectionProps> = (props) => {
  const status = props.status || 'ready';
  const bgColor = statusColor[status] && statusColor[status].color;

  return (
    <>
      <span></span>
      <style jsx>{`
        span {
          position: relative;
          display: inline-block;
          margin: 0 0.4em;
          width: 1em;
          height: 1em;
          border-radius: 50%;
          overflow: hidden;
          vertical-align: text-bottom;
        }

        span::before {
          position: absolute;
          top: 0;
          left: 0;
          content: '';
          width: 1em;
          height: 1em;
          background: ${bgColor};
        }
      `}</style>
    </>
  );
};
