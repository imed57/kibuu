import React from 'react';
import { useTimer } from 'react-timer-hook';

interface MyTimerProps {
  expiryTimestamp: Date;
}

const MyTimer: React.FC<MyTimerProps> = ({ expiryTimestamp }) => {
  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp, autoStart: true });

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div
        style={{
          fontFamily: 'Press Start 2P',
          fontSize: '1.9rem',
          color: 'black',
          fontWeight: 'bold',
          padding: '20px',
          borderRadius: '20px',
          border: '3px solid black',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          display: 'inline-block',
          boxShadow: '0 2px 8px rgba(34, 198, 248, 1)',
          textShadow: '0 2px 8px rgb(34, 198, 248)',
        }}
      >
        <div>
          <span>{days < 10 ? `0${days}` : days}</span>d :
          <span>{hours < 10 ? `0${hours}` : hours}</span>h :
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>m :
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>s
        </div>
      </div>
    </div>
  );
};

export default MyTimer;
