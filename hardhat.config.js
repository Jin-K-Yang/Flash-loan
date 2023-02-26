require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const INFURA_API_KEY = process.env.INFURA_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      }
    }
  }
};
