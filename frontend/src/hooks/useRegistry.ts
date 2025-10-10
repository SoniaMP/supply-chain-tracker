import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";

import AccessManagerABI from "../abis/AccessManager.json";
import { useWallet } from "../context/metamask/provider";
import { EUserRole } from "../interfaces";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ACCESS_MANAGER_ADDRESS;

export const useRegistry = () => {
  const { provider } = useWallet();
  const [registry, setRegistry] = useState<Contract | null>(null);

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

  async function requestRole(role: EUserRole) {
    if (!registry) {
      throw new Error("El contrato no está inicializado");
    }

    try {
      const roleBytes32 = ethers.keccak256(ethers.toUtf8Bytes(role));

      const tx = await registry.requestRole(roleBytes32);
      console.log("📤 Transacción enviada:", tx.hash);

      const receipt = await tx.wait();
      console.log("✅ Transacción confirmada:", receipt.transactionHash);

      return receipt;
    } catch (err: any) {
      console.error("❌ Error en requestRole:", err);
      throw new Error(err.reason || err.message || "Fallo en la transacción");
    }
  }

  return { registry, requestRole };
};
