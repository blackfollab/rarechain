import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    bsc: {
      url: process.env.BNB_RPC,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
