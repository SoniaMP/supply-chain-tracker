import { useEffect } from "react";
import { useAccessManager } from "../../hooks/useAccessManager";

export const useGlobalState = () => {
  const { userInfo, isUserInfoLoading, requestRole, approveRole } =
    useAccessManager();

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  return {
    userInfo,
    isUserInfoLoading,
    requestRole,
    approveRole,
  };
};
