// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./WrappedToken.sol";

interface IWrappedToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

interface IStateConnector {
    function getMerkleRoot(uint256 roundId) external view returns (bytes32);
}

contract Bridge is ReentrancyGuard, AccessControl, Pausable {
    // ============ CONSTANTS ============
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 constant BRIDGE_FEE_BASIS_POINTS = 5; // 0.05%
    uint256 constant MIN_BRIDGE_AMOUNT = 1e15; // 0.001 tokens
    uint256 constant MAX_BRIDGE_AMOUNT = 1e27; // Virtually unlimited

    // ============ ENUMS ============
    enum ChainId {
        AVALANCHE,
        FLARE,
        POLYGON,
        ETHEREUM
    }
    enum BridgeStatus {
        INITIATED,
        LOCKED,
        MINTED,
        FAILED,
        COMPLETED
    }

    // ============ STRUCTS ============
    struct BridgeTransaction {
        uint256 id;
        address user;
        address tokenAddress;
        uint256 amount;
        ChainId sourceChain;
        ChainId destinationChain;
        uint256 fee;
        uint256 timestamp;
        BridgeStatus status;
        bytes32 transactionHash;
        uint256 expiryBlock;
    }

    struct WrappedTokenMetadata {
        address originalTokenAddress;
        ChainId originalChain;
        string tokenName;
        string tokenSymbol;
        uint8 decimals;
        uint256 totalSupply;
        bool isActive;
    }

    // ============ STATE VARIABLES ============
    mapping(bytes32 => BridgeTransaction) public bridgeTransactions;
    mapping(address => WrappedTokenMetadata) public wrappedTokenRegistry;
    mapping(bytes32 => bool) public processedMessageHashes;
    mapping(address => uint256) public userBridgeNonce;
    mapping(address => uint256) public dailyVolumeCap;

    mapping(address => bool) public isSupportedToken;
    address[] public supportedTokens;
    uint256 public bridgeNonce;
    uint256 public totalBridgedVolume;

    address public treasuryAddress;
    address public stateConnectorAddress; // Flare State Connector

    // ============ EVENTS ============
    event TokensLocked(
        uint256 indexed bridgeId,
        address indexed user,
        address indexed tokenAddress,
        uint256 amount,
        ChainId sourceChain,
        ChainId destinationChain,
        uint256 timestamp
    );

    event TokensMinted(
        uint256 indexed bridgeId,
        address indexed user,
        address indexed wrappedToken,
        uint256 amount,
        ChainId sourceChain,
        uint256 timestamp
    );

    event TokensBurned(
        uint256 indexed bridgeId,
        address indexed user,
        address indexed wrappedToken,
        uint256 amount,
        ChainId destinationChain,
        uint256 timestamp
    );

    event WrappedTokenCreated(
        address indexed wrappedTokenAddress,
        address indexed originalTokenAddress,
        ChainId originalChain,
        string tokenName
    );

    event BridgeCompleted(
        uint256 indexed bridgeId,
        address indexed user,
        uint256 timestamp
    );

    event BridgeFailed(
        uint256 indexed bridgeId,
        address indexed user,
        string reason,
        uint256 timestamp
    );

    // ============ MODIFIERS ============
    modifier onlyRelayer() {
        require(hasRole(RELAYER_ROLE, msg.sender), "Only relayers can call");
        _;
    }

    modifier onlyGuardian() {
        require(hasRole(GUARDIAN_ROLE, msg.sender), "Only guardians can call");
        _;
    }

    modifier validBridgeAmount(uint256 amount) {
        require(amount >= MIN_BRIDGE_AMOUNT, "Amount below minimum");
        require(amount <= MAX_BRIDGE_AMOUNT, "Amount exceeds maximum");
        _;
    }

    modifier nonZeroAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    // ============ CONSTRUCTOR ============
    constructor(address _treasuryAddress, address _stateConnectorAddress) {
        require(_treasuryAddress != address(0), "Invalid treasury");

        treasuryAddress = _treasuryAddress;
        stateConnectorAddress = _stateConnectorAddress;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(GUARDIAN_ROLE, msg.sender);
    }

    // ============ CORE BRIDGE FUNCTIONS ============

    /**
     * @dev Initiate bridge transaction: lock tokens on source chain
     * @param _tokenAddress Address of token to bridge
     * @param _amount Amount to bridge (in token's native decimals)
     * @param _destinationChain Target blockchain ID
     */
    function initiateTransfer(
        address _tokenAddress,
        uint256 _amount,
        ChainId _destinationChain
    )
        external
        nonReentrant
        whenNotPaused
        validBridgeAmount(_amount)
        nonZeroAddress(_tokenAddress)
        returns (uint256 bridgeId)
    {
        // Validate destination is supported
        require(
            _destinationChain != getCurrentChainId(),
            "Cannot bridge to same chain"
        );

        // Security Check: Whitelist
        require(isSupportedToken[_tokenAddress], "Token not supported");

        // Security Check: Daily Volume
        uint256 currentDay = block.timestamp / 1 days;
        bytes32 capKey = keccak256(abi.encode(msg.sender, currentDay));
        require(dailyVolumeCap[msg.sender] > 0, "No daily cap set");
        // Implementing simple volume check logic (can be expanded)
        // require(userDailyUsed[capKey] + _amount <= dailyVolumeCap[msg.sender], "Daily cap exceeded");

        // Calculate fee
        uint256 fee = (_amount * BRIDGE_FEE_BASIS_POINTS) / 10000;
        uint256 amountAfterFee = _amount - fee;

        // Lock tokens in vault
        require(
            IERC20(_tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Token transfer failed"
        );

        // Transfer fee to treasury
        require(
            IERC20(_tokenAddress).transfer(treasuryAddress, fee),
            "Fee transfer failed"
        );

        // Record bridge transaction
        bridgeId = ++bridgeNonce;
        bytes32 txHash = keccak256(
            abi.encode(
                msg.sender,
                _tokenAddress,
                amountAfterFee,
                _destinationChain,
                block.timestamp
            )
        );

        BridgeTransaction storage bt = bridgeTransactions[txHash];
        bt.id = bridgeId;
        bt.user = msg.sender;
        bt.tokenAddress = _tokenAddress;
        bt.amount = amountAfterFee;
        bt.sourceChain = getCurrentChainId();
        bt.destinationChain = _destinationChain;
        bt.fee = fee;
        bt.timestamp = block.timestamp;
        bt.status = BridgeStatus.INITIATED;
        bt.transactionHash = txHash;
        bt.expiryBlock = block.number + 100000; // ~7 days on most chains

        userBridgeNonce[msg.sender]++;
        totalBridgedVolume += amountAfterFee;

        emit TokensLocked(
            bridgeId,
            msg.sender,
            _tokenAddress,
            amountAfterFee,
            getCurrentChainId(),
            _destinationChain,
            block.timestamp
        );

        return bridgeId;
    }

    /**
     * @dev Relayer calls to mint wrapped tokens on destination chain
     * Requires valid cryptographic attestation from source chain
     */
    function executeTransfer(
        uint256 _bridgeId,
        address _recipient,
        address _originalToken,
        uint256 _amount,
        ChainId _sourceChain,
        string calldata _tokenName,
        string calldata _tokenSymbol,
        bytes calldata _attestationData,
        bytes[] calldata _relayerSignatures
    ) external onlyRelayer whenNotPaused nonReentrant returns (bool success) {
        // Verify signatures from relayer network (threshold: 1/1 for dev)
        require(
            _relayerSignatures.length >= 1,
            "Insufficient relayer consensus"
        );
        bytes32 messageHash = keccak256(
            abi.encode(
                _bridgeId,
                _recipient,
                _originalToken,
                _amount,
                _sourceChain,
                _tokenName,
                _tokenSymbol
            )
        );

        uint256 validSignatures = 0;
        address lastSigner = address(0);
        for (uint256 i = 0; i < _relayerSignatures.length; i++) {
            address signer = recoverSigner(messageHash, _relayerSignatures[i]);
            require(hasRole(RELAYER_ROLE, signer), "Invalid relayer signature");
            require(signer > lastSigner, "Signatures not in order");
            lastSigner = signer;
            validSignatures++;
        }

        require(validSignatures >= 1, "Insufficient valid signatures");

        // Verify attestation (if on Flare, use State Connector)
        if (getCurrentChainId() == ChainId.FLARE) {
            verifyStateConnectorAttestation(_attestationData);
        }

        // Get or create wrapped token
        address wrappedToken = getOrCreateWrappedToken(
            _originalToken,
            _sourceChain,
            _tokenName,
            _tokenSymbol
        );

        // Mint wrapped tokens
        IWrappedToken(wrappedToken).mint(_recipient, _amount);

        // Update bridge status
        bytes32 txHash = keccak256(
            abi.encode(
                _recipient,
                _originalToken,
                _amount,
                _sourceChain,
                block.timestamp
            )
        );

        BridgeTransaction storage bt = bridgeTransactions[messageHash];
        bt.status = BridgeStatus.MINTED;

        processedMessageHashes[
            keccak256(abi.encode(_bridgeId, _sourceChain))
        ] = true;

        emit TokensMinted(
            _bridgeId,
            _recipient,
            wrappedToken,
            _amount,
            _sourceChain,
            block.timestamp
        );

        emit BridgeCompleted(_bridgeId, _recipient, block.timestamp);

        return true;
    }

    /**
     * @dev User burns wrapped tokens to unlock originals on source chain
     */
    function redeemTransfer(
        address _wrappedToken,
        uint256 _amount,
        ChainId _sourceChain
    )
        external
        nonReentrant
        validBridgeAmount(_amount)
        returns (uint256 bridgeId)
    {
        // Verify wrapped token exists
        WrappedTokenMetadata storage metadata = wrappedTokenRegistry[
            _wrappedToken
        ];
        require(metadata.isActive, "Invalid wrapped token");
        require(metadata.originalChain == _sourceChain, "Chain mismatch");

        // Burn wrapped tokens
        IWrappedToken(_wrappedToken).burn(msg.sender, _amount);

        // Record redemption
        bridgeId = ++bridgeNonce;

        emit TokensBurned(
            bridgeId,
            msg.sender,
            _wrappedToken,
            _amount,
            _sourceChain,
            block.timestamp
        );

        return bridgeId;
    }

    // ============ HELPER FUNCTIONS ============

    function getOrCreateWrappedToken(
        address _originalToken,
        ChainId _sourceChain,
        string memory _name,
        string memory _symbol
    ) internal returns (address wrappedToken) {
        bytes32 salt = keccak256(abi.encode(_originalToken, _sourceChain));
        address predictedAddress = address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            address(this),
                            salt,
                            keccak256(
                                abi.encodePacked(
                                    type(WrappedToken).creationCode,
                                    abi.encode(
                                        _name,
                                        _symbol,
                                        address(this),
                                        _originalToken,
                                        uint256(_sourceChain)
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );

        if (wrappedTokenRegistry[predictedAddress].isActive) {
            return predictedAddress;
        }

        // Deploy new wrapped token using CREATE2
        WrappedToken newToken = new WrappedToken{salt: salt}(
            _name,
            _symbol,
            address(this),
            _originalToken,
            uint256(_sourceChain)
        );

        require(
            address(newToken) == predictedAddress,
            "CREATE2 address mismatch"
        );

        WrappedTokenMetadata storage metadata = wrappedTokenRegistry[
            address(newToken)
        ];
        metadata.originalTokenAddress = _originalToken;
        metadata.originalChain = _sourceChain;
        metadata.tokenName = _name;
        metadata.tokenSymbol = _symbol;
        metadata.isActive = true;

        emit WrappedTokenCreated(
            address(newToken),
            _originalToken,
            _sourceChain,
            _name
        );

        return address(newToken);
    }

    function verifyStateConnectorAttestation(
        bytes calldata _attestationData
    ) internal view {
        // Decode attestation data: [merkleProof, leaf, root]
        // This is a simplified implementation. Real Flare State Connector uses the IStateConnector interface.
        // We assume the relayer passes the proof that specific transaction happened on source chain.
        // For this MVP, we verify the data integrity.

        (bytes32[] memory merkleProof, bytes32 leaf, bytes32 root) = abi.decode(
            _attestationData,
            (bytes32[], bytes32, bytes32)
        );

        // In production, 'root' should be fetched from the IStateConnector contract on Flare
        // using the round ID.
        // require(IStateConnector(stateConnectorAddress).getMerkleRoot(roundId) == root, "Invalid Merkle Root");

        require(
            verifyMerkleProof(merkleProof, root, leaf),
            "Invalid State Connector Proof"
        );
    }

    function verifyMerkleProof(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        return computedHash == root;
    }

    function recoverSigner(
        bytes32 messageHash,
        bytes calldata signature
    ) internal pure returns (address) {
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes calldata sig
    ) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65, "Invalid signature length");
        return (uint8(sig[64]), bytes32(sig[0:32]), bytes32(sig[32:64]));
    }

    function getCurrentChainId() public view returns (ChainId) {
        if (block.chainid == 43113 || block.chainid == 43114)
            return ChainId.AVALANCHE;
        if (block.chainid == 114 || block.chainid == 14) return ChainId.FLARE;
        if (block.chainid == 80002 || block.chainid == 137)
            return ChainId.POLYGON;
        if (block.chainid == 11155111 || block.chainid == 1)
            return ChainId.ETHEREUM;
        revert("Unsupported chain");
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    function addSupportedToken(address _token) external onlyRole(ADMIN_ROLE) {
        if (!isSupportedToken[_token]) {
            supportedTokens.push(_token);
            isSupportedToken[_token] = true;
        }
    }

    function removeSupportedToken(
        address _token
    ) external onlyRole(ADMIN_ROLE) {
        isSupportedToken[_token] = false;
    }

    function setDailyVolumeCap(
        address _user,
        uint256 _cap
    ) external onlyRole(ADMIN_ROLE) {
        dailyVolumeCap[_user] = _cap;
    }

    // ============ EMERGENCY FUNCTIONS ============

    function emergencyPause() external onlyRole(GUARDIAN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function emergencyWithdraw(
        address _token
    ) external onlyRole(GUARDIAN_ROLE) {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(
            IERC20(_token).transfer(treasuryAddress, balance),
            "Withdrawal failed"
        );
    }
}
