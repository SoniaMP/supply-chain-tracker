import { useAccessManager } from "../../hooks/useAccessManager";

export const useGlobalState = () => {
  const { userInfo, isUserInfoLoading, requestRole, approveRole } =
    useAccessManager();

  return {
    userInfo,
    isUserInfoLoading,
    requestRole,
    approveRole,
  };
};
