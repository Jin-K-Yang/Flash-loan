// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    address payable owner;

    constructor(address _addressProvider) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = payable(msg.sender);
    }

    function executeOperation(address asset, uint256 amount, uint256 premium, address initiator, bytes calldata params) external override returns (bool) {
        // You need to send fund to this contract in order to repay the flash loan amount + premium because there is no arbitrageur stratagy in this example
        // Arbitrageur stratagy logic goes here

        // At the end of your logic above, this contract owes the flashloaned amount + premiums.
        // Therefore ensure your contract has enough to repay these amounts.

        // Approve the Pool contract allowance to *pull* the owed amount
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function requestFlashLoan(address _token, uint256 _amount) public {
        address reciverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(reciverAddress, asset, amount, params, referralCode);
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    receive() external payable {}
}
