const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("FlashLoan", function () {
  before(async function () {
    const [owner] = await ethers.getSigners();

    // see https://docs.aave.com/developers/deployed-contracts/v3-mainnet/ethereum-mainnet
    const ADDRESS_POOL_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";

    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy(ADDRESS_POOL_PROVIDER);
  })
});
