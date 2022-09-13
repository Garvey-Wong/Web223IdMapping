require("@nomiclabs/hardhat-waffle");
require('hardhat-conflux');

require('dotenv').config();

// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    testnet: {
      url: "https://test.confluxrpc.com",
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      chainId: 1,
    }
  }
};
