import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { useGlobal } from "@context/global/provider";
import { useWallet } from "@context/metamask/provider";

import { UserRole } from "../../interfaces";
import Consumer from "./components/Consumer";
import Admin from "./components/Admin";
import Retailer from "./components/Retailer";
import Factory from "./components/Factory";
import Producer from "./components/Producer";
import ControlPanel from "./components/ControlPanel";

const mappingRolesToComponents: { [key in UserRole]: React.FC } = {
  [UserRole.ADMIN]: Admin,
  [UserRole.CONSUMER]: Consumer,
  [UserRole.RETAILER]: Retailer,
  [UserRole.FACTORY]: Factory,
  [UserRole.PRODUCER]: Producer,
};

const DashboardRouter = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const { userInfo, isUserInfoLoading } = useGlobal();

  if (!account) {
    navigate("/login", { replace: true });
    return null;
  }

  if (isUserInfoLoading || !userInfo) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!userInfo) {
    navigate("/request-role", { replace: true });
    return null;
  }

  const DashboardComponent =
    mappingRolesToComponents[userInfo.role as UserRole];

  return (
    <ControlPanel>
      <DashboardComponent />
    </ControlPanel>
  );
};

export default DashboardRouter;
