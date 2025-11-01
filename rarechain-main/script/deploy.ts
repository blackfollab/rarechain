import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("YourContractName"); // e.g., "NodeInvestment"
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  console.log(`✅ Contract deployed to: ${(await contract.getAddress())}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
