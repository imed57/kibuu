import React from 'react';
import styles from '../styles/Game-dialog.module.css'; // Import the CSS Module

const AlertDialog = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render if not open

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h2 className={styles.title}>How to Play</h2>
                <p className={styles.content}>Help Kibu find his soulmate, Bubu the Scaled One!</p>
                <div className={styles.list}>
                Tap to make Kibu fly.
                Get the highest score to have a chance for winning a part of the vault!
                Good luck!
                </div>
                <button onClick={onClose} className={styles.button}>Start Game</button>
            </div>
        </div>
    );
};

export default AlertDialog;
