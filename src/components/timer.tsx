import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import styles from '../styles/Timer.module.css';
import { getContractInstance } from 'config/contract';

const MyTimer: React.FC = () => {
  const [expiryTimestamp, setExpiryTimestamp] = useState<Date | null>(null);
  const { seconds, minutes, hours, days, restart } = useTimer({
    expiryTimestamp: expiryTimestamp || new Date(),
    autoStart: true,
  });

  // Fetch expiry timestamp from the blockchain
  const fetchExpiryTimestamp = async () => {
    try {
      const contract = await getContractInstance();
      if (contract) {
        const timestampFromContract = await contract.lastDistributionTime();
        const newExpiryTimestamp = new Date((timestampFromContract.toNumber() + 172800) * 1000); // Adding 1 week 604800 86400
        setExpiryTimestamp(newExpiryTimestamp);

        // Restart the timer with the new expiry timestamp
        restart(newExpiryTimestamp);
      }
    } catch (error) {
      console.error('Error fetching expiry timestamp:', error);
    }
  };

  useEffect(() => {
    // Fetch the expiry timestamp when the component mounts
    fetchExpiryTimestamp();

    // Optionally, you can refetch the timestamp periodically
    const interval = setInterval(fetchExpiryTimestamp, 4000); // Fetch every 4 seconds
    return () => clearInterval(interval);
  }, []);

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
