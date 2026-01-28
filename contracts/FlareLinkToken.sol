// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FlareLinkToken is ERC20, Ownable {
    constructor() ERC20("FlareLink Token", "FLT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function faucet() public {
        _mint(msg.sender, 100 * 10 ** decimals());
    }
}
