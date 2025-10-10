import { Navigate } from "react-router-dom";

import { useWallet } from "@context/metamask/provider";
import { useGlobal } from "@context/global/provider";

import { EAccountStatus } from "../interfaces";
import { CardLayout } from "../layouts";
import { Typography } from "@mui/material";
import UnderRevision from "@components/UserAccess/UnderRevision";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireRole = true,
}: ProtectedRouteProps) => {
  const { account } = useWallet();
  const { userInfo } = useGlobal();

  if (!account || !userInfo) return <Navigate to="/login" replace />;

  console.log("AccountInfo: ", userInfo);

  if (requireRole && !userInfo.role) {
    return <Navigate to="/request-role" replace />;
  }

  if (requireRole && userInfo.status === EAccountStatus.Pending) {
    return <UnderRevision />;
  }

  if (userInfo.status === EAccountStatus.Rejected)
    return (
      <CardLayout>
        <Typography>
          Tu solicitud fue rechazada. Contacta con el administrador.
        </Typography>
      </CardLayout>
    );

  if (userInfo.status === EAccountStatus.Canceled)
    return (
      <CardLayout>
        <Typography>Tu acceso fue cancelado.</Typography>
      </CardLayout>
    );

  return <>{children}</>;
};

export default ProtectedRoute;
