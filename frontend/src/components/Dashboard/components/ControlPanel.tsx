import { Typography } from "@mui/material";

import UnderRevision from "@components/UserAccess/UnderRevision";
import { useGlobal } from "@context/global/provider";

import { AccountStatus } from "../../../interfaces";
import { CardLayout } from "../../../layouts";

const ControlPanel = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useGlobal();

  if (!userInfo) return null;

  if (userInfo.status === AccountStatus.Pending) {
    return <UnderRevision />;
  }

  if (userInfo.status === AccountStatus.Rejected)
    return (
      <CardLayout>
        <Typography>
          Tu solicitud fue rechazada. Contacta con el administrador.
        </Typography>
      </CardLayout>
    );

  if (userInfo.status === AccountStatus.Canceled)
    return (
      <CardLayout>
        <Typography>Tu acceso fue cancelado.</Typography>
      </CardLayout>
    );

  if (userInfo.status === AccountStatus.Approved) {
    return <>{children}</>;
  }

  return null;
};

export default ControlPanel;
