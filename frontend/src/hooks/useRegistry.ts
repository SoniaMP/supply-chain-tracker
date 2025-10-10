import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AccessManagerABI from "../abis/AccessManager.json";
import { useWallet } from "../context/metamask/provider";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ACCESS_MANAGER_ADDRESS;

export const useRegistry = () => {
  const { provider } = useWallet();
  const [registry, setRegistry] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!provider) {
      setRegistry(null);
      return;
    }

    (async () => {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          AccessManagerABI,
          signer
        );
        setRegistry(contract);
      } catch (err) {
        console.error("Error al conectar con el contrato AccessManager:", err);
        setRegistry(null);
      }
    })();
  }, [provider]);

  return registry;
};
