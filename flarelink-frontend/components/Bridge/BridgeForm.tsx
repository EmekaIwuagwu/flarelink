'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, usePublicClient } from 'wagmi';
import { parseEther, formatEther, formatGwei } from 'viem';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ChainSelector from './ChainSelector';
import TransactionModal, { TransactionStep } from './TransactionModal';
import styles from '@/styles/bridge.module.css';
import BridgeABI from '../../lib/abi/Bridge.json';
import Link from 'next/link';

// ============ TYPE DEFINITIONS ============

interface ChainConfig {
  id: number;
  name: string;
  symbol: string;
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  explorerUrl?: string; // Made optional to match ChainSelector
}

// ============ CHAIN CONFIGURATIONS ============

const CHAINS: Record<string, ChainConfig> = {
  AVALANCHE: {
    id: 43113,
    name: 'Avalanche Fuji',
    symbol: 'AVAX',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_FUJI || '0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE') as `0x${string}`,
    tokenAddress: '0x7B418fcb4b5a1c612Ce5E19B9F23017041E995Ee' as `0x${string}`,
    explorerUrl: 'https://testnet.snowtrace.io/tx/',
  },
  FLARE: {
    id: 114,
    name: 'Flare Coston2',
    symbol: 'C2FLR',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2 || '0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275') as `0x${string}`,
    tokenAddress: '0x70FB9FfDA73a0518F16E32fc2905351fd1a97565' as `0x${string}`,
    explorerUrl: 'https://coston2-explorer.flare.network/tx/',
  },
  ETHEREUM: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_SEPOLIA || '0xE7635764e8CE10DF60201E3c2120af43D823Ccc2') as `0x${string}`,
    tokenAddress: '0x341f64F97De07e3B6d47D244B5a0A8B7a6292267' as `0x${string}`,
    explorerUrl: 'https://sepolia.etherscan.io/tx/',
  },
  POLYGON: {
    id: 80002,
    name: 'Polygon Amoy',
    symbol: 'MATIC',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY || '0x2B53AF2fF168345C409da33d5cc68270F2905cA7') as `0x${string}`,
    tokenAddress: '0xEbd238521aabd9834A1be844a4eBE1acA820b416' as `0x${string}`,
    explorerUrl: 'https://amoy.polygonscan.com/tx/',
  },
};

const CHAIN_BY_ID: Record<number, ChainConfig> = {
  43113: CHAINS.AVALANCHE,
  114: CHAINS.FLARE,
  11155111: CHAINS.ETHEREUM,
  80002: CHAINS.POLYGON,
};

// ============ ERC20 ABI ============

const ERC20ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;

// ============ BRIDGE FORM COMPONENT ============

export default function BridgeForm() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();
  const publicClient = usePublicClient();

  // State
  const [sourceChain, setSourceChain] = useState<ChainConfig>(CHAINS.AVALANCHE);
  const [destChain, setDestChain] = useState<ChainConfig>(CHAINS.ETHEREUM);
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(CHAINS.AVALANCHE.tokenAddress);
  const [amount, setAmount] = useState('100');

  // Gas state
  const [gasPrice, setGasPrice] = useState<bigint | null>(null);
  const [baseFee, setBaseFee] = useState<bigint | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<TransactionStep>('idle');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalTxHash, setModalTxHash] = useState<string | undefined>();
  const [destTxHash, setDestTxHash] = useState<string | undefined>();
  const [modalError, setModalError] = useState<string | undefined>();
  const [currentAction, setCurrentAction] = useState<'approve' | 'bridge' | null>(null);

  // ============ FETCH GAS PRICES ============

  const fetchGasPrice = useCallback(async () => {
    if (!publicClient) return;
    try {
      const [gasPriceResult, block] = await Promise.all([
        publicClient.getGasPrice(),
        publicClient.getBlock({ blockTag: 'latest' })
      ]);
      setGasPrice(gasPriceResult);
      setBaseFee(block.baseFeePerGas || null);
    } catch (e) {
      console.error('Failed to fetch gas price:', e);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [fetchGasPrice]);

  // ============ SYNC WITH WALLET NETWORK ============

  useEffect(() => {
    if (chain && CHAIN_BY_ID[chain.id]) {
      const walletChain = CHAIN_BY_ID[chain.id];
      setSourceChain(walletChain);
      if (walletChain.tokenAddress !== '0x0000000000000000000000000000000000000000') {
        setTokenAddress(walletChain.tokenAddress);
      }
      if (destChain.id === walletChain.id) {
        const alternatives = Object.values(CHAINS).filter(c => c.id !== walletChain.id);
        if (alternatives.length > 0) {
          setDestChain(alternatives[0]);
        }
      }
    }
  }, [chain, destChain.id]);

  // ============ SMART GAS ESTIMATION ============

  const getOptimalGasConfig = useCallback(() => {
    if (!baseFee) {
      // Fallback values if we can't fetch
      const chainMinimums: Record<number, bigint> = {
        80002: BigInt(30000000000),  // Polygon Amoy: 30 Gwei
        114: BigInt(30000000000),    // Flare Coston2: 30 Gwei  
        43113: BigInt(2500000000),   // Avalanche Fuji: 2.5 Gwei
        11155111: BigInt(2000000000) // Sepolia: 2 Gwei
      };
      const minTip = chainMinimums[sourceChain.id] || BigInt(2000000000);
      return {
        maxPriorityFeePerGas: minTip,
        maxFeePerGas: minTip * BigInt(3), // 3x for safety
      };
    }

    // Dynamic calculation: baseFee * 2.5 + tip
    const tip = baseFee / BigInt(4); // 25% of base fee as tip
    const minTips: Record<number, bigint> = {
      80002: BigInt(25000000000),  // Polygon requires 25 Gwei min
      114: BigInt(25000000000),    // Flare requires 25 Gwei min
    };
    const actualTip = minTips[sourceChain.id]
      ? (tip > minTips[sourceChain.id] ? tip : minTips[sourceChain.id])
      : tip > BigInt(1500000000) ? tip : BigInt(1500000000);

    const maxFee = (baseFee * BigInt(25) / BigInt(10)) + actualTip; // baseFee * 2.5 + tip

    return {
      maxPriorityFeePerGas: actualTip,
      maxFeePerGas: maxFee,
    };
  }, [baseFee, sourceChain.id]);

  // ============ DERIVED VALUES ============

  const currentBridgeAddress = sourceChain.bridgeAddress;
  const isNetworkMatched = chain?.id === sourceChain.id;
  const amountBI = amount ? parseEther(amount) : BigInt(0);

  const getChainEnum = (chainId: number): number => {
    switch (chainId) {
      case 43113: return 0;
      case 114: return 1;
      case 80002: return 2;
      case 11155111: return 3;
      default: return 0;
    }
  };

  // ============ CONTRACT READS ============

  const { data: tokenBalance, refetch: refetchBalance } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: isConnected && !!address && isNetworkMatched && tokenAddress !== '0x0000000000000000000000000000000000000000',
    watch: true,
  });

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: [address!, currentBridgeAddress],
    enabled: isConnected && !!address && isNetworkMatched && tokenAddress !== '0x0000000000000000000000000000000000000000',
    watch: true,
  }) as { data: bigint | undefined, refetch: () => void };

  // ============ CONTRACT PREPARATION ============

  // Prepare approval
  const { config: approveConfig, error: prepareApproveError } = usePrepareContractWrite({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [currentBridgeAddress, amountBI],
    enabled: isConnected && !!address && isNetworkMatched && amountBI > 0 && tokenAddress !== '0x0000000000000000000000000000000000000000',
    // We'll let wagmi estimate, but we can override in write if needed
  });

  // Prepare bridge
  const { config: bridgeConfig, error: prepareBridgeError } = usePrepareContractWrite({
    address: currentBridgeAddress,
    abi: BridgeABI,
    functionName: 'initiateTransfer',
    args: [tokenAddress, amountBI, getChainEnum(destChain.id)],
    enabled: isConnected && !!address && isNetworkMatched && amountBI > 0 && !!allowance && allowance >= amountBI,
  });

  // ============ CONTRACT WRITES ============

  const { write: writeApprove, data: approveData, isLoading: isApproveLoading, reset: resetApprove } = useContractWrite({
    ...approveConfig,
    onSettled(data, error) {
      if (error) {
        setModalStep('error');
        setModalTitle('Approval Failed');
        setModalError(error.message);
      }
    }
  });

  const { write: writeBridge, data: bridgeData, isLoading: isBridgeLoading, reset: resetBridge } = useContractWrite({
    ...bridgeConfig,
    onSettled(data, error) {
      if (error) {
        setModalStep('error');
        setModalTitle('Bridge Failed');
        setModalError(error.message);
      }
    }
  });

  // ============ TRANSACTION RECEIPTS ============

  const { isLoading: isApproveTxLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      setModalStep('success');
      setModalTitle('Approval Successful!');
      setModalDescription('Your tokens have been approved. You can now proceed with the bridge transfer.');
      refetchAllowance();
    },
    onError: (err) => {
      setModalStep('error');
      setModalTitle('Approval Failed');
      setModalError(err.message);
    },
  });

  const { isLoading: isBridgeTxLoading } = useWaitForTransaction({
    hash: bridgeData?.hash,
    onSuccess: (receipt) => {
      setModalStep('success');
      setModalTitle('Bridge Transfer Initiated!');
      setModalDescription('Your tokens are being bridged. The relayer will complete the transfer on the destination chain.');
      refetchBalance();

      // NEW: Notify relayer instantly so the transaction appears in history immediately
      try {
        const baseUrl = process.env.NEXT_PUBLIC_RELAYER_API_URL || 'http://localhost:8080/api/v1';
        fetch(`${baseUrl}/bridge/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txHash: bridgeData?.hash,
            sourceTxHash: bridgeData?.hash,
            user: address,
            amount: amountBI.toString(),
            sourceChain: sourceChain.name,
            destChain: destChain.name,
            tokenAddress: tokenAddress,
            status: 'locked',
            timestamp: Math.floor(Date.now() / 1000)
          })
        });
      } catch (e) {
        console.error('Failed to track bridge:', e);
      }
    },
    onError: (err) => {
      setModalStep('error');
      setModalTitle('Bridge Failed');
      setModalError(err.message);
    },
  });

  // ============ HANDLE APPROVE ============

  const handleApprove = async () => {
    if (!writeApprove) {
      setModalOpen(true);
      setModalStep('error');
      setModalTitle('Wallet Error');
      // Extract a readable message from the prepare error
      const msg = prepareApproveError?.message || '';
      if (msg.includes('insufficient funds')) {
        setModalError('Insufficient MATIC for gas fees. You need a small amount of native tokens to pay for the transaction.');
      } else if (msg.includes('user rejected')) {
        setModalError('Transaction was rejected in your wallet.');
      } else {
        setModalError(msg || 'Transaction not ready. Please ensure your wallet is connected to the right network and has MATIC for gas.');
      }
      return;
    }

    setCurrentAction('approve');
    setModalOpen(true);
    setModalStep('confirming');
    setModalTitle('Approving Tokens');
    setModalDescription(`Approve the bridge to spend ${amount} FLT tokens on your behalf.`);
    setModalError(undefined);
    setModalTxHash(undefined);

    try {
      writeApprove();
    } catch (err: any) {
      setModalStep('error');
      setModalTitle('Approval Failed');
      setModalError(err.message || 'Unknown error occurred');
    }
  };

  // ============ HANDLE BRIDGE ============

  const handleBridge = async () => {
    if (!writeBridge) {
      setModalOpen(true);
      setModalStep('error');
      setModalTitle('Wallet Error');
      const msg = prepareBridgeError?.message || '';
      if (msg.includes('insufficient funds')) {
        setModalError('Insufficient MATIC for gas fees. Please add some native MATIC to your wallet.');
      } else {
        setModalError(msg || 'Transaction not ready. Please confirm your allowance and gas balance.');
      }
      return;
    }

    setCurrentAction('bridge');
    setModalOpen(true);
    setModalStep('confirming');
    setModalTitle('Initiating Bridge Transfer');
    setModalDescription(`Bridging ${amount} FLT from ${sourceChain.name} to ${destChain.name}`);
    setModalError(undefined);
    setModalTxHash(undefined);

    try {
      writeBridge();
    } catch (err: any) {
      setModalStep('error');
      setModalTitle('Bridge Failed');
      setModalError(err.message || 'Unknown error occurred');
    }
  };

  // ============ WATCH TX HASH CHANGES ============

  useEffect(() => {
    if (approveData?.hash) {
      setModalTxHash(approveData.hash);
      setModalStep('pending');
      setModalDescription('Transaction submitted. Waiting for confirmation...');
    }
  }, [approveData?.hash]);

  useEffect(() => {
    if (bridgeData?.hash) {
      setModalTxHash(bridgeData.hash);
      setModalStep('pending');
      setModalDescription('Transaction submitted. Waiting for confirmation...');
    }
  }, [bridgeData?.hash]);

  // ============ POLL RELAYER STATUS ============

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (modalStep === 'success' && currentAction === 'bridge' && bridgeData?.hash) {
      const pollRelayer = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_RELAYER_API_URL || 'http://localhost:8080/api/v1';
          const res = await fetch(`${baseUrl}/bridge/status/${bridgeData.hash}`);
          if (res.ok) {
            const result = await res.json();
            const record = result.data;

            if (record && record.destTxHash) {
              setModalTitle('Bridge Completion Successful!');
              setModalDescription(`Transfer completed! Your tokens have been minted on ${record.destChain}.`);
              setDestTxHash(record.destTxHash);
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      };

      interval = setInterval(pollRelayer, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [modalStep, currentAction, bridgeData?.hash]);

  // ============ MODAL CLOSE/RETRY ============

  const handleModalClose = () => {
    setModalOpen(false);
    if (currentAction === 'approve') {
      resetApprove();
    } else if (currentAction === 'bridge') {
      resetBridge();
      setDestTxHash(undefined);
    }
    setCurrentAction(null);
  };

  const handleRetry = () => {
    if (currentAction === 'approve') {
      handleApprove();
    } else if (currentAction === 'bridge') {
      handleBridge();
    }
  };

  // ============ CHAIN HANDLERS ============

  const handleSourceChainChange = (newChain: ChainConfig) => {
    setSourceChain(newChain);
    if (newChain.tokenAddress !== '0x0000000000000000000000000000000000000000') {
      setTokenAddress(newChain.tokenAddress);
    }
    if (switchNetwork) {
      switchNetwork(newChain.id);
    }
  };

  const handleDestChainChange = (newChain: ChainConfig) => {
    setDestChain(newChain);
  };

  const swapChains = () => {
    const temp = sourceChain;
    setSourceChain(destChain);
    setDestChain(temp);
    if (destChain.tokenAddress !== '0x0000000000000000000000000000000000000000') {
      setTokenAddress(destChain.tokenAddress);
    }
    if (switchNetwork) {
      switchNetwork(destChain.id);
    }
  };

  // ============ DERIVED STATE ============

  const isLoading = isApproveLoading || isApproveTxLoading || isBridgeLoading || isBridgeTxLoading;
  const needsApproval = allowance === undefined || allowance < amountBI;

  // ============ RENDER ============

  return (
    <>
      <TransactionModal
        isOpen={modalOpen}
        step={modalStep}
        title={modalTitle}
        description={modalDescription}
        txHash={modalTxHash}
        error={modalError}
        onClose={handleModalClose}
        onRetry={handleRetry}
        explorerUrl={modalTxHash ? `${sourceChain.explorerUrl}${modalTxHash}` : undefined}
        destExplorerUrl={destTxHash ? `${destChain.explorerUrl}${destTxHash}` : undefined}
      />

      <div className={styles.bridgeContainer}>
        <div className={styles.gradientBg}></div>

        <motion.div
          className={styles.bridgeContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {/* Header Badge */}
            <div className={styles.headerBadge}>
              <span className={styles.liveIcon}></span>
              Cross-Chain Bridge
            </div>

            {/* Source Chain */}
            <div className={styles.formSection}>
              <label className={styles.label}>FROM</label>
              <ChainSelector
                selected={sourceChain}
                onChange={handleSourceChainChange}
                exclude={destChain}
              />
            </div>

            {/* Swap Button */}
            <motion.button
              className={styles.swapButton}
              onClick={swapChains}
              disabled={isLoading}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </motion.button>

            {/* Destination Chain */}
            <div className={styles.formSection}>
              <label className={styles.label}>TO</label>
              <ChainSelector
                selected={destChain}
                onChange={handleDestChainChange}
                exclude={sourceChain}
              />
            </div>

            {/* Token Address */}
            <div className={styles.formSection}>
              <label className={styles.label}>TOKEN ADDRESS</label>
              <input
                type="text"
                className={styles.input}
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
                disabled={isLoading}
              />
            </div>

            {/* Amount */}
            <div className={styles.formSection}>
              <div className={styles.amountHeader}>
                <label className={styles.label}>AMOUNT</label>
                {tokenBalance !== undefined && (
                  <span className={styles.balance}>
                    Balance: <strong>{parseFloat(ethers.formatUnits(tokenBalance as bigint, 18)).toFixed(4)}</strong>
                  </span>
                )}
              </div>
              <div className={styles.amountInputWrapper}>
                <input
                  type="number"
                  className={styles.amountInput}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className={styles.maxButton}
                  onClick={() => {
                    if (tokenBalance) {
                      setAmount(ethers.formatUnits(tokenBalance as bigint, 18));
                    }
                  }}
                  disabled={isLoading}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Bridge Fee</span>
                <span className={styles.infoValue}>0.05%</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Est. Time</span>
                <span className={styles.infoValue}>2-5 min</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Gas Price</span>
                <span className={styles.infoValue}>
                  {baseFee ? `~${parseFloat(formatGwei(baseFee)).toFixed(1)} Gwei` : 'Loading...'}
                </span>
              </div>
            </div>

            {/* Network Mismatch Warning */}
            {!isNetworkMatched && isConnected && (
              <motion.div
                className={styles.warningBox}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <span className={styles.warningIcon}>⚠️</span>
                Please switch your wallet to {sourceChain.name}
              </motion.div>
            )}

            {/* Action Buttons */}
            {!isConnected ? (
              <motion.button
                className={styles.primaryButton}
                disabled
                whileHover={{ scale: 1.02 }}
              >
                Connect Wallet to Continue
              </motion.button>
            ) : !isNetworkMatched ? (
              <motion.button
                className={styles.primaryButton}
                onClick={() => switchNetwork?.(sourceChain.id)}
                style={{ background: 'linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Switch to {sourceChain.name}
              </motion.button>
            ) : (
              <>
                {needsApproval ? (
                  <motion.button
                    className={styles.primaryButton}
                    onClick={handleApprove}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.spinner}></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        🔐 Approve Tokens
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    className={styles.primaryButton}
                    onClick={handleBridge}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.spinner}></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        🌉 Bridge Tokens
                      </>
                    )}
                  </motion.button>
                )}

                <Link href="/dashboard" className={styles.secondaryButton}>
                  📜 View Transaction History
                </Link>
              </>
            )}

            {/* Trust Badge */}
            <div className={styles.trustBadge}>
              <span>🔒</span> Secured by FlareLink Protocol
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
