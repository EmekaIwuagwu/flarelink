# 🌉 FlareLink - Multi-Chain Bridge Protocol

<div align="center">

![FlareLink](https://img.shields.io/badge/FlareLink-Cross--Chain%20Bridge-crimson?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue?style=flat-square)
![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A production-ready, multi-chain token bridge enabling seamless cross-chain transfers between EVM-compatible blockchains.**

[Features](#features) • [Architecture](#architecture) • [Quick Start](#quick-start) • [Deployment](#deployment) • [Security](#security)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Supported Networks](#-supported-networks)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Smart Contracts](#-smart-contracts)
- [Relayer](#-relayer)
- [Frontend](#-frontend)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Security](#-security)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Multi-Chain Support** - Bridge tokens between Avalanche, Ethereum, Flare, and Polygon networks
- **Lock & Mint Mechanism** - Secure token bridging with wrapped token creation
- **Real-time Relayer** - Go-based relayer with multi-chain event listeners
- **Gas Optimization** - Chain-specific gas strategies for cost-effective transfers
- **Modern UI** - Next.js 14 frontend with network switcher and transaction tracking
- **Role-Based Access** - Admin and relayer roles for secure operations
- **Daily Volume Caps** - Configurable limits to prevent abuse
- **Event-Driven Architecture** - Efficient blockchain event processing

---

## 🌐 Supported Networks

| Network | Chain ID | Type | Status |
|---------|----------|------|--------|
| **Avalanche Fuji** | 43113 | Testnet | ✅ Active |
| **Ethereum Sepolia** | 11155111 | Testnet | ✅ Active |
| **Flare Coston2** | 114 | Testnet | ✅ Active |
| **Polygon Amoy** | 80002 | Testnet | ✅ Active |

### Deployed Contract Addresses

#### Bridge Contracts
| Network | Address |
|---------|---------|
| Avalanche Fuji | `0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE` |
| Ethereum Sepolia | `0xE7635764e8CE10DF60201E3c2120af43D823Ccc2` |
| Flare Coston2 | `0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275` |
| Polygon Amoy | `0x2B53AF2fF168345C409da33d5cc68270F2905cA7` |

#### FLT Token Contracts (FlareLink Token)
| Network | Address |
|---------|---------|
| Avalanche Fuji | `0x7B418fcb4b5a1c612Ce5E19B9F23017041E995Ee` |
| Ethereum Sepolia | `0x341f64F97De07e3B6d47D244B5a0A8B7a6292267` |
| Flare Coston2 | `0x70FB9FfDA73a0518F16E32fc2905351fd1a97565` |
| Polygon Amoy | `0xEbd238521aabd9834A1be844a4eBE1acA820b416` |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FlareLink Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐        │
│  │   Source    │       │   Relayer   │       │ Destination │        │
│  │   Chain     │       │   (Go)      │       │   Chain     │        │
│  │             │       │             │       │             │        │
│  │ ┌─────────┐ │       │ ┌─────────┐ │       │ ┌─────────┐ │        │
│  │ │ Bridge  │ │──────▶│ │Listener │ │──────▶│ │ Bridge  │ │        │
│  │ │Contract │ │ Event │ │         │ │Execute│ │Contract │ │        │
│  │ └─────────┘ │       │ └─────────┘ │       │ └─────────┘ │        │
│  │      │      │       │      │      │       │      │      │        │
│  │      ▼      │       │      ▼      │       │      ▼      │        │
│  │ ┌─────────┐ │       │ ┌─────────┐ │       │ ┌─────────┐ │        │
│  │ │  Lock   │ │       │ │Executor │ │       │ │  Mint   │ │        │
│  │ │ Tokens  │ │       │ │         │ │       │ │ Wrapped │ │        │
│  │ └─────────┘ │       │ └─────────┘ │       │ └─────────┘ │        │
│  └─────────────┘       └─────────────┘       └─────────────┘        │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Frontend (Next.js 14)                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │ Network  │  │  Bridge  │  │  History │  │ Settings │      │   │
│  │  │ Selector │  │   Form   │  │   Page   │  │   Page   │      │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Bridge Flow

1. **User initiates transfer** on source chain via frontend
2. **Tokens are locked** in the source bridge contract
3. **`TokensLocked` event** is emitted
4. **Relayer detects** the event and validates it
5. **Relayer calls `executeTransfer`** on destination bridge
6. **Wrapped tokens are minted** to the recipient on destination chain

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- Go >= 1.21
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/EmekaIwuagwu/flarelink.git
cd flarelink

# Install smart contract dependencies
npm install

# Install frontend dependencies
cd flarelink-frontend
npm install
cd ..

# Install relayer dependencies
cd flarelink-relayer
go mod download
cd ..
```

### Environment Setup

```bash
# Copy environment example
cp .env.example .env

# Edit .env with your private keys and RPC URLs
```

Required environment variables:
```env
# Private Keys
PRIVATE_KEY=0x...
RELAYER_KEY=...

# RPC URLs
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
FLARE_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
SEPOLIA_RPC_URL=https://1rpc.io/sepolia
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology

# Bridge Addresses (after deployment)
NEXT_PUBLIC_BRIDGE_ADDRESS_FUJI=0x...
NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2=0x...
NEXT_PUBLIC_BRIDGE_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY=0x...
```

### Running the System

```bash
# Terminal 1: Start the relayer
cd flarelink-relayer
go run cmd/relayer/main.go

# Terminal 2: Start the frontend
cd flarelink-frontend
npm run dev

# Frontend will be available at http://localhost:3000
```

---

## 📜 Smart Contracts

### Bridge.sol

The main bridge contract that handles token locking and minting.

**Key Functions:**

| Function | Description |
|----------|-------------|
| `initiateTransfer(token, amount, destChain)` | Lock tokens and emit transfer event |
| `executeTransfer(...)` | Mint wrapped tokens on destination (relayer only) |
| `addSupportedToken(token)` | Whitelist a token for bridging |
| `setDailyVolumeCap(user, cap)` | Set transfer limits |

**Events:**

```solidity
event TokensLocked(
    uint256 indexed bridgeId,
    address indexed user,
    address indexed tokenAddress,
    uint256 amount,
    uint8 sourceChain,
    uint8 destinationChain,
    uint256 timestamp
);

event TokensReleased(
    uint256 indexed bridgeId,
    address indexed recipient,
    address tokenAddress,
    uint256 amount
);
```

### WrappedToken.sol

ERC20 token that represents bridged assets on destination chains.

### FlareLinkToken.sol

Test token (FLT) with built-in faucet for testing purposes.

```solidity
// Anyone can get 1000 FLT for testing
function faucet() external;
```

---

## ⚙️ Relayer

The relayer is a Go application that monitors multiple chains and relays bridge transactions.

### Features

- **Multi-chain listeners** - Parallel event monitoring
- **Automatic nonce management** - Fresh nonce from blockchain per tx
- **Chain-specific gas fees** - Optimized for each network
- **BadgerDB persistence** - Transaction state storage
- **REST API** - Status endpoints for frontend

### Configuration

Gas tip minimums per chain:
| Chain | Minimum Tip |
|-------|-------------|
| Polygon Amoy | 26 Gwei |
| Flare Coston2 | 26 Gwei |
| Avalanche Fuji | 2 Gwei |
| Ethereum Sepolia | 2 Gwei |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/bridge/status/:id` | GET | Get bridge transaction status |
| `/api/v1/bridge/user/:address` | GET | Get user's bridge history |

---

## 🎨 Frontend

Modern Next.js 14 frontend with:

- **Network Selector** - Switch between chains with auto-refresh
- **Bridge Form** - Intuitive token transfer interface
- **Transaction History** - Track all your bridge transactions
- **Real-time Updates** - Token balance and status updates

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Main dashboard |
| `/dashboard/transfer` | Bridge interface |
| `/dashboard/history` | Transaction history |
| `/bridge/status/[txHash]` | Transaction status page |

---

## 🛠 Deployment

### Deploy to a New Network

```bash
# Deploy Bridge + FLT Token (for new networks)
npx hardhat run scripts/deploy_full.ts --network <networkName>

# Deploy only FLT Token (if bridge exists)
npx hardhat run scripts/deploy_token_only.ts --network <networkName>
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

---

## 🔒 Security

### Access Control

- **DEFAULT_ADMIN_ROLE** - Can manage roles and pause contract
- **RELAYER_ROLE** - Can execute bridge transfers
- **Pausable** - Emergency stop functionality
- **ReentrancyGuard** - Protection against reentrancy attacks

### Security Features

- ✅ Role-based access control (OpenZeppelin)
- ✅ Reentrancy protection
- ✅ Daily volume caps
- ✅ Token whitelist
- ✅ Pausable operations
- ✅ Safe math (Solidity 0.8+)

### Audit Status

| Item | Status |
|------|--------|
| Smart Contracts | ✅ Internal Review Passed |
| Relayer | ✅ Internal Review Passed |
| Frontend | ✅ Functional Testing Passed |

---

## 🧪 Testing

### Smart Contract Tests

```bash
npx hardhat test
```

### Integration Test

```bash
npx hardhat run scripts/test_bridge.ts
```

### Manual Testing Checklist

- [ ] Connect wallet on source chain
- [ ] Approve token spending
- [ ] Initiate bridge transfer
- [ ] Verify relayer picks up event
- [ ] Confirm wrapped tokens on destination

---

## 📁 Project Structure

```
flarelink/
├── contracts/                 # Solidity smart contracts
│   ├── Bridge.sol            # Main bridge contract
│   ├── WrappedToken.sol      # Wrapped token implementation
│   └── FlareLinkToken.sol    # Test token
├── flarelink-frontend/        # Next.js frontend
│   ├── app/                  # App router pages
│   ├── components/           # React components
│   └── lib/                  # Utilities and ABIs
├── flarelink-relayer/         # Go relayer
│   ├── cmd/relayer/          # Main entry point
│   └── internal/             # Core modules
│       ├── api/              # REST API
│       ├── bridge/           # Executor & Listener
│       └── state/            # BadgerDB store
├── scripts/                   # Deployment scripts
├── hardhat.config.ts         # Hardhat configuration
└── README.md                 # This file
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Smart contract libraries
- [Hardhat](https://hardhat.org/) - Development framework
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Gin](https://gin-gonic.com/) - Go web framework

---

<div align="center">

**Built with ❤️ by [Emeka Iwuagwu](https://github.com/EmekaIwuagwu)**

</div>
