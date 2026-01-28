// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract WrappedToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    address public originalTokenAddress;
    uint256 public originalChainId;

    constructor(
        string memory _name,
        string memory _symbol,
        address _bridgeAddress,
        address _originalToken,
        uint256 _originalChain
    ) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, _bridgeAddress);
        _grantRole(BURNER_ROLE, _bridgeAddress);

        originalTokenAddress = _originalToken;
        originalChainId = _originalChain;
    }

    function mint(address _to, uint256 _amount) external onlyRole(MINTER_ROLE) {
        _mint(_to, _amount);
    }

    function burn(
        address _from,
        uint256 _amount
    ) external onlyRole(BURNER_ROLE) {
        _burn(_from, _amount);
    }

    function burnFromUser(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
