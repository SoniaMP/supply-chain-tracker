import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ethereum = (window as any).ethereum;

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (!ethereum || !ethereum.isMetaMask) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);
    try {
      const prov = new ethers.BrowserProvider(ethereum);
      await prov.send("eth_requestAccounts", []);
      setProvider(prov);

      const sgn = await prov.getSigner();
      const acct = await sgn.getAddress();
      setAccount(acct);
    } catch (err) {
      console.error(err);
      setError("Error connecting wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  useEffect(() => {
    if (!ethereum || !provider) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      setIsConnecting(true);
      if (accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
      setIsConnecting(false);
    };

    const handleChainChanged = () => window.location.reload();

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [provider]);

  return { account, isConnecting, connectWallet, disconnectWallet, error };
};
