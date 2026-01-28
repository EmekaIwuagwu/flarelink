'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite, useWaitForTransaction, usePrepareContractWrite, useContractRead } from 'wagmi';
import { parseEther } from 'viem';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import ChainSelector from './ChainSelector';
import TokenInput from './TokenInput';
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
}

// ============ CHAIN CONFIGURATIONS ============
// All addresses are hardcoded with fallbacks to ensure reliability

const CHAINS: Record<string, ChainConfig> = {
  AVALANCHE: {
    id: 43113,
    name: 'Avalanche Fuji',
    symbol: 'AVAX',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_FUJI || '0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE') as `0x${string}`,
    tokenAddress: '0x7B418fcb4b5a1c612Ce5E19B9F23017041E995Ee' as `0x${string}`, // FLT on Fuji
  },
  FLARE: {
    id: 114,
    name: 'Flare Coston2',
    symbol: 'C2FLR',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2 || '0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275') as `0x${string}`,
    tokenAddress: '0x70FB9FfDA73a0518F16E32fc2905351fd1a97565' as `0x${string}`, // FLT on Coston2
  },
  ETHEREUM: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_SEPOLIA || '0xE7635764e8CE10DF60201E3c2120af43D823Ccc2') as `0x${string}`,
    tokenAddress: '0x341f64F97De07e3B6d47D244B5a0A8B7a6292267' as `0x${string}`, // FLT on Sepolia
  },
  POLYGON: {
    id: 80002,
    name: 'Polygon Amoy',
    symbol: 'MATIC',
    bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY || '0x2B53AF2fF168345C409da33d5cc68270F2905cA7') as `0x${string}`,
    tokenAddress: '0xEbd238521aabd9834A1be844a4eBE1acA820b416' as `0x${string}`, // FLT on Amoy
  },
};


// Map chain IDs to chain configs for quick lookup
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

  // State: Source and Destination chains
  const [sourceChain, setSourceChain] = useState<ChainConfig>(CHAINS.AVALANCHE);
  const [destChain, setDestChain] = useState<ChainConfig>(CHAINS.ETHEREUM);

  // State: Token address (automatically set based on source chain)
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(CHAINS.AVALANCHE.tokenAddress);

  // State: Amount to bridge
  const [amount, setAmount] = useState('100');

  // ============ SYNC WITH WALLET NETWORK ============
  // When user's wallet network changes, update source chain and token address
  useEffect(() => {
    if (chain && CHAIN_BY_ID[chain.id]) {
      const walletChain = CHAIN_BY_ID[chain.id];
      setSourceChain(walletChain);

      // Auto-set the correct token for this chain
      if (walletChain.tokenAddress !== '0x0000000000000000000000000000000000000000') {
        setTokenAddress(walletChain.tokenAddress);
      }

      // Ensure destination is different from source
      if (destChain.id === walletChain.id) {
        // Pick a different destination
        const alternatives = Object.values(CHAINS).filter(c => c.id !== walletChain.id);
        if (alternatives.length > 0) {
          setDestChain(alternatives[0]);
        }
      }
    }
  }, [chain, destChain.id]);

  // ============ HANDLE CHAIN CHANGES ============

  const handleSourceChainChange = (newChain: ChainConfig) => {
    setSourceChain(newChain);

    // Auto-update token address for the new source chain
    if (newChain.tokenAddress !== '0x0000000000000000000000000000000000000000') {
      setTokenAddress(newChain.tokenAddress);
    }

    // Switch wallet network
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

    // Update token for new source
    if (destChain.tokenAddress !== '0x0000000000000000000000000000000000000000') {
      setTokenAddress(destChain.tokenAddress);
    }

    // Switch wallet network to new source
    if (switchNetwork) {
      switchNetwork(destChain.id);
    }
  };

  // ============ DERIVED VALUES ============

  const currentBridgeAddress = sourceChain.bridgeAddress;
  const isNetworkMatched = chain?.id === sourceChain.id;
  const amountBI = amount ? parseEther(amount) : BigInt(0);

  // Map chainId to contract enum
  const getChainEnum = (chainId: number): number => {
    switch (chainId) {
      case 43113: return 0;  // AVALANCHE
      case 114: return 1;    // FLARE
      case 80002: return 2;  // POLYGON
      case 11155111: return 3; // ETHEREUM
      default: return 0;
    }
  };

  // ============ CONTRACT READS ============

  // Read token balance
  const { data: tokenBalance, refetch: refetchBalance } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: isConnected && !!address && isNetworkMatched && tokenAddress !== '0x0000000000000000000000000000000000000000',
    watch: true,
  });

  // Read token allowance
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: [address!, currentBridgeAddress],
    enabled: isConnected && !!address && isNetworkMatched && tokenAddress !== '0x0000000000000000000000000000000000000000',
    watch: true,
  }) as { data: bigint | undefined, refetch: () => void };

  // ============ CONTRACT WRITES ============

  // Prepare approve transaction
  const { config: approveConfig, error: approvePrepareError } = usePrepareContractWrite({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [currentBridgeAddress, amountBI],
    enabled: isConnected && !!address && isNetworkMatched && amountBI > 0 && tokenAddress !== '0x0000000000000000000000000000000000000000',
  });

  const { write: writeApprove, isLoading: isApproveLoading, data: approveData } = useContractWrite(approveConfig);

  const { isLoading: isApproveTxLoading, isSuccess: isApproveSuccess } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      refetchAllowance();
    },
  });

  // Prepare bridge transaction
  const { config: bridgeConfig, error: bridgePrepareError } = usePrepareContractWrite({
    address: currentBridgeAddress,
    abi: BridgeABI,
    functionName: 'initiateTransfer',
    args: [
      tokenAddress,
      amountBI,
      getChainEnum(destChain.id)
    ],
    enabled: isConnected && !!address && isNetworkMatched && amountBI > 0 &&
      (allowance !== undefined && allowance >= amountBI) &&
      tokenAddress !== '0x0000000000000000000000000000000000000000',
  });

  const { data: bridgeData, write: writeBridge, isLoading: isBridgeLoading } = useContractWrite(bridgeConfig);

  const { isLoading: isBridgeTxLoading, isSuccess: isBridgeSuccess, data: bridgeTxReceipt } = useWaitForTransaction({
    hash: bridgeData?.hash,
  });

  // ============ REDIRECT ON SUCCESS ============

  useEffect(() => {
    if (isBridgeSuccess && bridgeTxReceipt && bridgeData?.hash) {
      if (bridgeTxReceipt.status === 'success') {
        router.push(`/bridge/status/${bridgeData.hash}`);
      } else {
        alert('Bridge transaction failed. Please check:\n1. Token is whitelisted\n2. Sufficient balance\n3. Token is approved');
      }
    }
  }, [isBridgeSuccess, bridgeTxReceipt, bridgeData?.hash, router]);

  // ============ DERIVED STATE ============

  const isLoading = isApproveLoading || isApproveTxLoading || isBridgeLoading || isBridgeTxLoading;
  const needsApproval = allowance === undefined || allowance < amountBI;

  // ============ HANDLERS ============

  const handleApprove = () => {
    writeApprove?.();
  };

  const handleBridge = () => {
    writeBridge?.();
  };

  // ============ RENDER ============

  return (
    <div className={styles.bridgeContainer}>
      <div className={styles.gradientBg}></div>

      <div className={styles.bridgeContent}>
        <div className={styles.formCard}>

          {/* Source Chain */}
          <div className={styles.formSection}>
            <label className={styles.label}>From</label>
            <ChainSelector
              selected={sourceChain}
              onChange={handleSourceChainChange}
              exclude={destChain}
            />
          </div>

          {/* Swap Button */}
          <button
            className={styles.swapButton}
            onClick={swapChains}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </button>

          {/* Destination Chain */}
          <div className={styles.formSection}>
            <label className={styles.label}>To</label>
            <ChainSelector
              selected={destChain}
              onChange={handleDestChainChange}
              exclude={sourceChain}
            />
          </div>

          {/* Token Address */}
          <div className={styles.formSection}>
            <label className={styles.label}>Token Address</label>
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
            <div className="flex justify-between items-center mb-2">
              <label className={styles.label} style={{ margin: 0 }}>Amount</label>
              {tokenBalance !== undefined && (
                <span className="text-xs text-gray-400">
                  Balance: <span className="text-gray-300">{ethers.formatUnits(tokenBalance as bigint, 18)}</span>
                </span>
              )}
            </div>
            <TokenInput
              value={amount}
              onChange={setAmount}
              disabled={isLoading}
              onMaxClick={() => {
                if (tokenBalance) {
                  setAmount(ethers.formatUnits(tokenBalance as bigint, 18));
                }
              }}
            />
          </div>

          {/* Fee Display */}
          <div className={styles.feeDisplay}>
            <div className={styles.feeRow}>
              <span>Bridge Fee</span>
              <span>0.05%</span>
            </div>
            <div className={styles.feeRow}>
              <span>Est. Time</span>
              <span>2-5 minutes</span>
            </div>
          </div>

          {/* Error Messages */}
          {!isNetworkMatched && isConnected && (
            <div style={{ color: '#FF8C00', marginBottom: '10px', fontSize: '12px', background: 'rgba(255,140,0,0.1)', padding: '8px', borderRadius: '4px' }}>
              <strong>Network Mismatch:</strong> Please switch your wallet to {sourceChain.name}
            </div>
          )}

          {approvePrepareError && isNetworkMatched && (
            <div style={{ color: '#ff4d4d', marginBottom: '10px', fontSize: '12px', background: 'rgba(255,0,0,0.1)', padding: '8px', borderRadius: '4px' }}>
              <strong>Approval Error:</strong> {approvePrepareError.message.split('\n')[0]}
            </div>
          )}

          {bridgePrepareError && !needsApproval && isNetworkMatched && (
            <div style={{ color: '#ff4d4d', marginBottom: '10px', fontSize: '12px', background: 'rgba(255,0,0,0.1)', padding: '8px', borderRadius: '4px' }}>
              <strong>Bridge Error:</strong> {bridgePrepareError.message.split('\n')[0]}
            </div>
          )}

          {/* Success Messages */}
          {isBridgeSuccess && (
            <div style={{ color: '#50C878', marginBottom: '10px', fontWeight: 'bold' }}>
              Bridge Transaction Successful!
            </div>
          )}
          {isApproveSuccess && !isBridgeSuccess && (
            <div style={{ color: '#50C878', marginBottom: '10px', fontSize: '12px' }}>
              Approval Successful. Now you can bridge.
            </div>
          )}

          {/* Action Buttons */}
          {!isConnected ? (
            <button className={styles.primaryButton} disabled>
              Connect Wallet
            </button>
          ) : !isNetworkMatched ? (
            <button
              className={styles.primaryButton}
              onClick={() => switchNetwork?.(sourceChain.id)}
              style={{ background: '#FF8C00' }}
            >
              Switch Network to {sourceChain.name}
            </button>
          ) : (
            <>
              {needsApproval ? (
                <button
                  className={styles.primaryButton}
                  onClick={handleApprove}
                  disabled={isLoading || !writeApprove}
                >
                  {isApproveLoading || isApproveTxLoading ? (
                    <>
                      <span className={styles.spinner}></span>
                      Approving...
                    </>
                  ) : (
                    'Approve Token'
                  )}
                </button>
              ) : (
                <button
                  className={styles.primaryButton}
                  onClick={handleBridge}
                  disabled={isLoading || !writeBridge}
                >
                  {isBridgeLoading || isBridgeTxLoading ? (
                    <>
                      <span className={styles.spinner}></span>
                      Bridging...
                    </>
                  ) : (
                    'Bridge Tokens'
                  )}
                </button>
              )}

              <Link href="/dashboard" className={styles.secondaryButton} style={{ textAlign: 'center', textDecoration: 'none' }}>
                View History
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
