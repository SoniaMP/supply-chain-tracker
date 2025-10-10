import { useEffect, useState } from "react";
import { IAccountInfo } from "../../interfaces";
import { useWallet } from "../metamask/provider";
import { useRegistry } from "../../hooks/useRegistry";
import { fromDtoToUi } from "../../utils/accessAdapters";

export const useGlobalState = () => {
  const [userInfo, setUserInfo] = useState<IAccountInfo | null>(null);
  const { account } = useWallet();
  const { registry } = useRegistry();

  useEffect(() => {
    if (!registry || !account) return;
    (async () => {
      const info: IAccountInfo = await registry.getAccountInfo(account);
      const accountInfo = fromDtoToUi(info);
      setUserInfo(accountInfo);
    })();
  }, [registry, account]);

  return { userInfo };
};
