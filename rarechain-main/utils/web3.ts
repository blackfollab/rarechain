import { ethers } from "ethers";
import ABI from "./abi.json";

const ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

async function getContract() {
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(ADDRESS, ABI, signer);
}

export async function investInPlan(id: number, amount: string) {
  const contract = await getContract();
  const tx = await contract.invest(id, {
    value: ethers.parseEther(amount),
  });
  await tx.wait();
}

export async function getUserInvestments(address: string) {
  const contract = await getContract();
  return await contract.getInvestments(address);
}

export async function withdrawInvestment(index: number) {
  const contract = await getContract();
  const tx = await contract.withdraw(index);
  await tx.wait();
}

// ✅ Listen to contract events
export async function listenToEvents(callback: (event: any) => void) {
  const contract = await getContract();

  contract.on("Invested", (user, planId, amount, timestamp) => {
    callback({
      type: "invested",
      user,
      planId: Number(planId),
      amount: Number(amount) / 1e18,
      timestamp: Number(timestamp),
    });
  });

  contract.on("Withdrawn", (user, amount, completed) => {
    callback({
      type: "withdrawn",
      user,
      amount: Number(amount) / 1e18,
      completed,
    });
  });
}

// Optional: Stop listening to all events (you can call this on cleanup)
export async function removeAllListeners() {
  const contract = await getContract();
  contract.removeAllListeners();
}
