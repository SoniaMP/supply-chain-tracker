import { getUiAccountsList } from "@utils/accessAdapters";
import { IAccountInfo } from "interfaces";

export const accessManagerServices = (contract: any) => {
  if (!contract) {
    console.warn("AccessManager contract not initialized");
  }

  async function getAccountInfo(account: string): Promise<IAccountInfo> {
    const info = await contract.getAccountInfo(account);
    return {
      account: info[0],
      role: info[1],
      status: Number(info[2]),
    };
  }

  async function requestRole(role: string) {
    // Transform role to its hash representation
    const tx = await contract.requestRole(role);
    await tx.wait();
    return true;
  }

  async function approveRole(account: string) {
    const tx = await contract.approveRole(account);
    await tx.wait();
    return true;
  }

  async function getAllAccounts() {
    const tx = await contract.getAllAccounts();
    console.log("All accounts raw:", tx);
    return getUiAccountsList(tx);
  }

  return {
    getAccountInfo,
    requestRole,
    approveRole,
    getAllAccounts,
  };
};
