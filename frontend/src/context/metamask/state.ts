import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { Signer } from "ethers";

const ethereum = (window as any).ethereum;

export const useWalletState = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [error, setError] = useState("");
  const isMetamaskInstalled = !!ethereum && ethereum.isMetaMask;

  const connectWallet = async () => {
    if (!isMetamaskInstalled) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);
    try {
      const prov = new ethers.BrowserProvider(ethereum);
      await prov.send("eth_requestAccounts", []);

      const sgn = await prov.getSigner();
      const acct = await sgn.getAddress();

      setSigner(sgn);
      setProvider(prov);
      setAccount(acct);
    } catch (err) {
      console.error(err);
      setError("Error connecting wallet");
    } finally {
      setIsConnecting(false);
      setError("");
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
        disconnectWallet();
      } else {
        try {
          const newProvider = new ethers.BrowserProvider(ethereum);
          const signer = await newProvider.getSigner();
          const newAccount = await signer.getAddress();

          setProvider(newProvider);
          setAccount(newAccount);
          setSigner(signer);
        } catch (err) {
          console.error("Error updating provider/account:", err);
          setError("Error updating account");
        }
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

  return {
    account,
    isConnecting,
    isMetamaskInstalled,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    error,
  };
};
