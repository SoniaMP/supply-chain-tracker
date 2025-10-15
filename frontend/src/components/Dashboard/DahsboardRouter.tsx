import { useGlobal } from "@context/global/provider";

import UnderRevision from "@components/UserAccess/UnderRevision";
import { AccountStatus, UserRole } from "../../interfaces";
import Consumer from "./components/Consumer";
import Admin from "./components/Admin";
import Retailer from "./components/Retailer";
import Factory from "./components/Factory";
import Producer from "./components/Producer";
import { CardLayout } from "../../layouts";
import { Typography } from "@mui/material";

const mappingRolesToComponents: { [key in UserRole]: React.FC } = {
  [UserRole.ADMIN]: Admin,
  [UserRole.CONSUMER]: Consumer,
  [UserRole.RETAILER]: Retailer,
  [UserRole.FACTORY]: Factory,
  [UserRole.PRODUCER]: Producer,
};

const DashboardRouter = () => {
  const { userInfo } = useGlobal();

  if (!userInfo) return null;

  const DashboardComponent =
    mappingRolesToComponents[userInfo.role as UserRole];

  switch (userInfo.status) {
    case AccountStatus.Pending:
      return <UnderRevision />;

    case AccountStatus.Rejected:
      return (
        <CardLayout>
          <Typography>
            Tu solicitud fue rechazada. Contacta con el administrador.
          </Typography>
        </CardLayout>
      );

    case AccountStatus.Canceled:
      return (
        <CardLayout>
          <Typography>Tu acceso fue cancelado.</Typography>
        </CardLayout>
      );

    default:
      return <DashboardComponent />;
  }
};

export default DashboardRouter;
