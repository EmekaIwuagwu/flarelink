'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TransactionModal.module.css';

export type TransactionStep = 'idle' | 'confirming' | 'pending' | 'success' | 'error';

interface TransactionModalProps {
    isOpen: boolean;
    step: TransactionStep;
    title: string;
    description: string;
    txHash?: string;
    error?: string;
    onClose: () => void;
    onRetry?: () => void;
    explorerUrl?: string;
    destExplorerUrl?: string;
}

const stepConfig = {
    confirming: {
        icon: '🔐',
        color: '#FFD700',
        title: 'Confirm in Wallet',
    },
    pending: {
        icon: '⏳',
        color: '#00BFFF',
        title: 'Processing',
    },
    success: {
        icon: '✅',
        color: '#50C878',
        title: 'Success!',
    },
    error: {
        icon: '❌',
        color: '#FF4D4D',
        title: 'Transaction Failed',
    },
    idle: {
        icon: '🌉',
        color: '#DC143C',
        title: 'Ready',
    },
};

export default function TransactionModal({
    isOpen,
    step,
    title,
    description,
    txHash,
    error,
    onClose,
    onRetry,
    explorerUrl,
    destExplorerUrl,
}: TransactionModalProps) {
    const config = stepConfig[step];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={step === 'success' || step === 'error' ? onClose : undefined}
                    />

                    {/* Modal */}
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Glow Effect */}
                        <div
                            className={styles.glow}
                            style={{ background: `radial-gradient(circle, ${config.color}33 0%, transparent 70%)` }}
                        />

                        {/* Icon */}
                        <motion.div
                            className={styles.iconContainer}
                            animate={step === 'pending' ? { rotate: 360 } : {}}
                            transition={{ duration: 2, repeat: step === 'pending' ? Infinity : 0, ease: 'linear' }}
                        >
                            <span className={styles.icon}>{config.icon}</span>
                        </motion.div>

                        {/* Title */}
                        <h2 className={styles.title} style={{ color: config.color }}>
                            {title || config.title}
                        </h2>

                        {/* Description */}
                        <p className={styles.description}>{description}</p>

                        {/* Transaction Links */}
                        {(txHash || explorerUrl || destExplorerUrl) && (
                            <div className={styles.txLinksGrid}>
                                {explorerUrl && (
                                    <div className={styles.txHashContainer}>
                                        <span className={styles.txLabel}>Source Transaction</span>
                                        <a
                                            href={explorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.txHash}
                                        >
                                            View on Explorer ↗
                                        </a>
                                    </div>
                                )}
                                {destExplorerUrl && (
                                    <div className={styles.txHashContainer + ' ' + styles.destLink}>
                                        <span className={styles.txLabel}>Destination Transaction</span>
                                        <a
                                            href={destExplorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.txHash}
                                        >
                                            View on Explorer ↗
                                        </a>
                                    </div>
                                )}
                                {txHash && !explorerUrl && !destExplorerUrl && (
                                    <div className={styles.txHashContainer}>
                                        <span className={styles.txLabel}>Transaction Hash</span>
                                        <span className={styles.txHashText}>
                                            {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className={styles.errorBox}>
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Progress Bar for Pending */}
                        {step === 'pending' && (
                            <div className={styles.progressContainer}>
                                <motion.div
                                    className={styles.progressBar}
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 30, ease: 'linear' }}
                                    style={{ background: config.color }}
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={styles.actions}>
                            {step === 'success' && (
                                <button className={styles.primaryBtn} onClick={onClose}>
                                    Done
                                </button>
                            )}
                            {step === 'error' && (
                                <>
                                    <button className={styles.secondaryBtn} onClick={onClose}>
                                        Close
                                    </button>
                                    {onRetry && (
                                        <button className={styles.primaryBtn} onClick={onRetry}>
                                            Try Again
                                        </button>
                                    )}
                                </>
                            )}
                            {(step === 'confirming' || step === 'pending') && (
                                <p className={styles.waitingText}>
                                    {step === 'confirming' ? 'Please confirm in your wallet...' : 'Waiting for confirmation...'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
