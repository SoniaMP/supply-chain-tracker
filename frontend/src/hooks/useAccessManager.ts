import useSWR from "swr";

import { useWallet } from "@context/metamask/provider";
import { getUiAccountInfo } from "@utils/accessAdapters";

import { accessManagerServices } from "../services/accessManagerServices";
import { useContractInstance } from "./useContracts";
import { ContractNames } from "../interfaces";

export const useAccessManager = () => {
  const { account } = useWallet();
  const contract = useContractInstance(ContractNames.ACCESS_MANAGER);
  const service = accessManagerServices(contract);

  const {
    data,
    isLoading,
    isValidating,
    mutate: reloadUserInfo,
    error,
  } = useSWR(
    account && contract ? ["accountInfo", account] : null,
    () => service.getAccountInfo(account as string),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const userInfo = data ? getUiAccountInfo(data) : null;

  const getAllAccounts = async () => await service.getAllAccounts();

  return {
    userInfo,
    isUserInfoLoading: isLoading && isValidating,
    error,
    reloadUserInfo,
    requestRole: service.requestRole,
    approveRole: service.approveRole,
    getAllAccounts,
  };
};
