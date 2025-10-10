import { Typography } from "@mui/material";

import Login from "@components/UserAccess/Login";
import { useGlobal } from "@context/global/provider";
import { useWallet } from "@context/metamask/provider";

import { EUserRole } from "../interfaces";
import { CardLayout } from "../layouts";

const DashboardRouter = () => {
  const { account } = useWallet();
  const { userInfo } = useGlobal();

  if (!account || !userInfo) {
    return <Login />;
  }

  switch (userInfo.role) {
    case EUserRole.ADMIN:
      return (
        <CardLayout>
          <Typography>Admin Dashboard</Typography>
        </CardLayout>
      );
    case EUserRole.CONSUMER:
      return (
        <CardLayout>
          <Typography>Consumer Dashboard</Typography>
        </CardLayout>
      );
    case EUserRole.RETAILER:
      return (
        <CardLayout>
          <Typography>Retailer Dashboard</Typography>
        </CardLayout>
      );
    case EUserRole.FACTORY:
      return (
        <CardLayout>
          <Typography>Factory Dashboard</Typography>
        </CardLayout>
      );
    case EUserRole.PRODUCER:
      return (
        <CardLayout>
          <Typography>Producer Dashboard</Typography>
        </CardLayout>
      );
    default:
      return (
        <div style={{ padding: "2rem" }}>No tienes un dashboard asignado.</div>
      );
  }
};

export default DashboardRouter;
