import { useWallet } from "@context/metamask/provider";
import { ethers } from "ethers";
import AccessManagerAbi from "../abis/AccessManager.json";

const CONTRACTS = {
  AccessManager: {
    address: import.meta.env.VITE_ACCESS_MANAGER_ADDRESS,
    abi: AccessManagerAbi,
  },
};

export const useContractInstance = (name: keyof typeof CONTRACTS) => {
  const { signer } = useWallet();
  const { address, abi } = CONTRACTS[name];

  if (!signer || !address) return null;

  return new ethers.Contract(address, abi, signer);
};
