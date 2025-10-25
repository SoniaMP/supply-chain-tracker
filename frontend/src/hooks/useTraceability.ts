import { useMemo } from "react";

import { useWallet } from "@context/metamask/provider";

import { useContractInstance } from "./useContracts";
import { ContractNames, ITokenTransfer, TransferStatus } from "../interfaces";
import { traceabilityServices } from "../services/traceabilityServices";

export const useTraceability = () => {
  const { account } = useWallet();
  const contract = useContractInstance(ContractNames.TRACEABILITY);

  const service = useMemo(
    () => (contract ? traceabilityServices(contract) : null),
    [contract]
  );

  const isServiceReady = !!service && !!account;

  function getTokensByUser() {
    if (!service || !account) return [];
    const tokens = service.getTokensByUser(account);
    return tokens;
  }

  async function getAllTokens() {
    if (!service || !account) return [];
    return service.getAllTokens();
  }

  function createToken(
    name: string,
    totalSupply: number,
    citizenFeatures: string,
    parentId: number = 0
  ): Promise<void> {
    if (!service) return Promise.resolve();
    return service.createToken(name, totalSupply, citizenFeatures, parentId);
  }

  function getTokenHistory(tokenId: number) {
    if (!service) return Promise.resolve([]);
    return service.getTokenHistory(tokenId);
  }

  function collectToken(tokenId: number): Promise<void> {
    if (!service) return Promise.resolve();
    return service.collectToken(tokenId);
  }

  function transfer(
    tokenId: number,
    to: string,
    amount: number
  ): Promise<void> {
    if (!service) return Promise.resolve();
    return service.transfer(tokenId, to, amount);
  }

  function getTransfers(status?: TransferStatus): Promise<ITokenTransfer[]> {
    if (!service) return Promise.resolve([]);
    return service.getTransfers(status);
  }

  function acceptTransfer(transferId: number) {
    if (!service) return Promise.resolve();
    return service.acceptTransfer(transferId);
  }

  function rejectTransfer(transferId: number) {
    if (!service) return Promise.resolve();
    return service.rejectTransfer(transferId);
  }

  function processToken(tokenId: number, features: string) {
    if (!service) return Promise.resolve();
    return service.processToken(tokenId, features);
  }

  return {
    isServiceReady,
    service,
    getTokensByUser,
    createToken,
    getTokenHistory,
    collectToken,
    getAllTokens,
    getTransfers,
    transfer,
    acceptTransfer,
    rejectTransfer,
    processToken,
  };
};
