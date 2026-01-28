import React from 'react';
import styles from '@/styles/bridge.module.css';

interface TokenInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    onMaxClick?: () => void;
}

export default function TokenInput({ value, onChange, disabled, onMaxClick }: TokenInputProps) {
    return (
        <div style={{ position: 'relative' }}>
            <input
                type="number"
                className={styles.input}
                placeholder="0.00"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
            {onMaxClick && (
                <button
                    onClick={onMaxClick}
                    disabled={disabled}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#DC143C',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    MAX
                </button>
            )}
        </div>
    );
}
