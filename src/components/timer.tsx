import React from 'react';
import { useTimer } from 'react-timer-hook';
import styles from '../styles/Timer.module.css'; // Import your CSS file

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
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.content}>
          <span>{days < 10 ? `0${days}` : days}</span>
          <span>d</span> :
          <span>{hours < 10 ? `0${hours}` : hours}</span>
          <span>h</span> :
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
          <span>m</span> :
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
          <span>s</span>
        </div>
      </div>
    </div>
  );
};

export default MyTimer;
