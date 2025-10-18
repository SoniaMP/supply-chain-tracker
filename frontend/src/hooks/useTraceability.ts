import { useMemo } from "react";

import { useWallet } from "@context/metamask/provider";

import { useContractInstance } from "./useContracts";
import { ContractNames } from "../interfaces";
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

  function createToken(
    name: string,
    totalSupply: number,
    citizenFeatures: string,
    parentId: number = 0
  ): Promise<void> {
    if (!service) return Promise.resolve();
    console.log("Creating token via hook...", {
      name,
      totalSupply,
      citizenFeatures,
      parentId,
    });
    return service.createToken(name, totalSupply, citizenFeatures, parentId);
  }

  function getTokenHistory(tokenId: number) {
    console.log(
      "Getting token history via hook for tokenId:",
      tokenId,
      service
    );
    if (!service) return Promise.resolve([]);
    return service.getTokenHistory(tokenId);
  }

  return {
    isServiceReady,
    service,
    getTokensByUser,
    createToken,
    getTokenHistory,
  };
};
