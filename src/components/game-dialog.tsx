import React from 'react';
import styles from '../styles/Game-dialog.module.css'; // Import the CSS Module

const AlertDialog = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render if not open

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h2 className={styles.title}>Game Instructions</h2>
                <p className={styles.content}>Welcome to the game! Here are some instructions:</p>
                <div className={styles.list}>
                    Use the arrow keys to navigate.
                    Press spacebar to jump.
                    Collect coins for points.
                </div>
                <button onClick={onClose} className={styles.button}>Start Game</button>
            </div>
        </div>
    );
};

export default AlertDialog;
