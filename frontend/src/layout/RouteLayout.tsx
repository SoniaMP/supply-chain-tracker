import { Navigate, Outlet } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { useWallet } from "@context/metamask/provider";
import { useGlobal } from "@context/global/provider";

const RouteLayout = () => {
  const { account } = useWallet();
  const { userInfo, isUserInfoLoading } = useGlobal();

  if (!account) {
    return <Navigate to="/login" replace />;
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
