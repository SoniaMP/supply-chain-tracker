import { Navigate, Outlet } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { useWallet } from "@context/metamask/provider";
import { useGlobal } from "@context/global/provider";
import { UserRole } from "../interfaces";

const RouteLayout = () => {
  const { account } = useWallet();
  const { userInfo, isServiceReady, isUserInfoLoading } = useGlobal();

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  if (!isServiceReady || isUserInfoLoading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!userInfo && location.pathname !== "/request-role") {
    return <Navigate to="/request-role" replace />;
  }

  if (
    location.pathname.startsWith("/admin-panel") &&
    userInfo?.role !== UserRole.ADMIN
  ) {
    console.warn("🔒 Usuario no autorizado. Redirigiendo a /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RouteLayout;
