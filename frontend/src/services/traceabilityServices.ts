import {
  getUiTokenHistoryEntry,
  getUiTokenInfo,
  getUiTokenTransfer,
} from "@utils/tokenAdapters";
import { ITokenHistoryEntry, ITokenInfo, TransferStatus } from "../interfaces";

export const traceabilityServices = (contract: any) => {
  if (!contract) {
    console.warn("Traceability contract not initialized");
  }

  async function getTokensByUser(account: string): Promise<ITokenInfo[]> {
    const tokens = await contract.getTokensByUser(account);
    return getUiTokenInfo(tokens);
  }

  async function createToken(
    name: string,
    totalSupply: number,
    citizenFeatures: string,
    parentId: number = 0
  ): Promise<void> {
    try {
      const tx = await contract.createToken(
        name,
        totalSupply,
        citizenFeatures || "{}",
        parentId
      );
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return;
      } else {
        throw new Error("Transaction failed (status 0)");
      }
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  async function collectToken(tokenId: number): Promise<void> {
    try {
      const tx = await contract.collectToken(tokenId);
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error("Transaction failed (status 0)");
      }
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  async function getAllTokens() {
    try {
      const tx = await contract.getAllTokens();
      return tx.map((token: any) => getUiTokenInfo([token])[0]);
    } catch (err) {
      console.error("Error getting all tokens:", err);
      return [];
    }
  }

  async function getTokenHistory(tokenId: number) {
    try {
      const filter = contract.filters.CustodyChanged(tokenId);
      const events = await contract.queryFilter(filter, 0, "latest");
      return events.map(({ args }: { args: ITokenHistoryEntry }) =>
        getUiTokenHistoryEntry(args)
      );
    } catch (err) {
      console.error("Error logging tokenId:", err);
    }
  }

  async function getTransfers(status: TransferStatus = TransferStatus.None) {
    try {
      const tx = await contract.getTransfers(status);
      let transfers = tx.map((t: any) => {
        return getUiTokenTransfer(t);
      });
      if (status !== TransferStatus.None) {
        transfers = transfers.filter((t: any) => t.status === status);
      }
      return transfers;
    } catch (err) {
      console.error("Error getting transfers:", err);
      return [];
    }
  }

  async function transfer(
    tokenId: number,
    to: string,
    amount: number
  ): Promise<void> {
    try {
      const tx = await contract.transfer(to, tokenId, amount);
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error("Transaction failed (status 0)");
      }
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  return {
    getTokensByUser,
    createToken,
    getTokenHistory,
    collectToken,
    getAllTokens,
    getTransfers,
    transfer,
  };
};
