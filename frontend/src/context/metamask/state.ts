import { useEffect, useState } from "react";
import { ethers, BrowserProvider, Signer } from "ethers";

const ethereum = (window as any).ethereum;

export const useWalletState = () => {
  const [account, setAccount] = useState<string | null>(() => {
    return localStorage.getItem("connectedAccount");
  });
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
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      setSigner(signer);
      setProvider(provider);
      setAccount(account);
      localStorage.setItem("connectedAccount", account);
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
    setSigner(null);
    setProvider(null);
    localStorage.removeItem("connectedAccount");
    localStorage.removeItem("userInfo");
  };

  useEffect(() => {
    if (!ethereum || !provider) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      setIsConnecting(true);
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        try {
          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const account = await signer.getAddress();

          setProvider(provider);
          setAccount(account);
          setSigner(signer);
          localStorage.setItem("connectedAccount", account);
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
