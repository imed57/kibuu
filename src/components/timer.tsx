import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import styles from '../styles/Timer.module.css';

interface MyTimerProps {
  expiryTimestamp: Date;
}

const MyTimer: React.FC<MyTimerProps> = ({ expiryTimestamp }) => {
  const [timestamp, setTimestamp] = useState(expiryTimestamp);

  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: timestamp, autoStart: true });

  useEffect(() => {
    setTimestamp(expiryTimestamp); // Update the timestamp when the prop changes

    const interval = setInterval(() => {
      setTimestamp(new Date(expiryTimestamp.getTime())); // Ensure timer is updating
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [expiryTimestamp]);

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
