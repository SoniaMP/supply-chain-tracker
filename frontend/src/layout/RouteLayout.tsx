import { Navigate, Outlet } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { useWallet } from "@context/metamask/provider";
import { useGlobal } from "@context/global/provider";

const RouteLayout = () => {
  const { account } = useWallet();
  const { userInfo, isServiceReady, isUserInfoLoading } = useGlobal();

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  console.log("RouteLayout render:", {
    userInfo,
    isServiceReady,
    isUserInfoLoading,
  });

  if (!isServiceReady) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isUserInfoLoading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!userInfo) {
    return <Navigate to="/request-role" replace />;
  }

  return <Outlet />;
};

export default RouteLayout;
