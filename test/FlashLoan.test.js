const { expect } = require("chai");
const IERC20ABI = require("../artifacts/@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol/IERC20.json").abi;

describe("FlashLoan", function () {
  const daiUserAddress = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503"
  const daiContractAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

  var flashLoan, dai;
  before(async function () {
    const [owner] = await ethers.getSigners();

    dai = await ethers.getContractAt(IERC20ABI, daiContractAddress);

    // see https://docs.aave.com/developers/deployed-contracts/v3-mainnet/ethereum-mainnet
    const ADDRESS_POOL_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";

    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    flashLoan = await FlashLoan.deploy(ADDRESS_POOL_PROVIDER);
  })

  describe("Flash loan", function () {
    it("should flash loan and pay back", async function () {
      // send dai to the contract in order to pay the fee of the flash loan(0.05% now but it may change in the future)
      const daiUser = await ethers.getImpersonatedSigner(daiUserAddress);
      await dai.connect(daiUser).transfer(flashLoan.address, ethers.utils.parseEther("1000"));

      // execute the flash loan
      await flashLoan.requestFlashLoan(dai.address, ethers.utils.parseEther("1000"));

      expect(ethers.utils.formatEther(await dai.balanceOf(flashLoan.address)) - 0).to.equal(1000 * (1 - 0.0005));
    })
  })
});
