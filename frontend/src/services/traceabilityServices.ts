import { getUiTokenInfo } from "@utils/tokenAdapters";
import { ITokenHistoryEntry, ITokenInfo } from "../interfaces";

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

  async function getTokenHistory(tokenId: number) {
    try {
      const filter = contract.filters.CustodyChanged(tokenId);
      const events = await contract.queryFilter(filter, 0, "latest");

      return events.map(({ args }: { args: ITokenHistoryEntry }) => ({
        id: Number(args.id),
        previousHolder: args.previousHolder,
        newHolder: args.newHolder,
        action: args.action,
        timestamp: new Date(Number(args.timestamp) * 1000).toLocaleString(),
        txHash: args.txHash,
      }));
    } catch (err) {
      console.error("Error logging tokenId:", err);
    }
  }

  return { getTokensByUser, createToken, getTokenHistory };
};
