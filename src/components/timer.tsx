import React from 'react';
import { useTimer } from 'react-timer-hook';

const MyTimer: React.FC = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 172800);

    const {
        seconds,
        minutes,
        hours,
        days,
    } = useTimer({ expiryTimestamp: time, autoStart: true });

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <div
                style={{
                    fontFamily: 'Press Start 2P',
                    fontSize: '1.9rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '20px',
                    borderRadius: '20px',
                    border: '3px solid #fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    display: 'inline-block',
                    boxShadow: '0 2px 8px rgba(4, 0, 255, 0.5)',
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
