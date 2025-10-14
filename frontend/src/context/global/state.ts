import { useEffect, useState } from "react";
import { IAccountInfo } from "../../interfaces";
import { useWallet } from "../metamask/provider";
import { useRegistry } from "../../hooks/useRegistry";
import { fromDtoToUi } from "../../utils/accessAdapters";

export const useGlobalState = () => {
  const [userInfo, setUserInfo] = useState<IAccountInfo | null>(null);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const { account } = useWallet();
  const { registry } = useRegistry();

  useEffect(() => {
    if (!registry || !account) {
      setUserInfo(null);
      setIsUserInfoLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      setIsUserInfoLoading(true);
      try {
        const info: IAccountInfo = await registry.getAccountInfo(account);
        const parsed = fromDtoToUi(info);
        setUserInfo(parsed);
      } catch (err) {
        console.error("Error loading userInfo:", err);
        setUserInfo(null);
      } finally {
        setIsUserInfoLoading(false);
      }
    };

    fetchUserInfo();
  }, [registry, account]);

  return { userInfo, isUserInfoLoading };
};
