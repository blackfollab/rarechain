import { expect } from "chai";
import { ethers } from "hardhat";

describe("NodeInvestment", function () {
  it("should deploy correctly", async function () {
    const Contract = await ethers.getContractFactory("NodeInvestment");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.properAddress;
  });

  it("should allow investing", async function () {
    const [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("NodeInvestment");
    const contract = await Contract.deploy();

    await contract.invest(0, { value: ethers.parseEther("0.1") });

    const investments = await contract.getInvestments(owner.address);
    expect(investments.length).to.be.greaterThan(0);
  });
});
