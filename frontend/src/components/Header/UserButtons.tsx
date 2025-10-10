import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Button } from "@mui/material";

import { useGlobal } from "../../context/global/provider";
import { EUserRole } from "../../interfaces";

const UserButtons = () => {
  const { userInfo } = useGlobal();

  if (userInfo?.role === EUserRole.ADMIN) {
    return <Button startIcon={<AdminPanelSettingsIcon />}>Admin Panel</Button>;
  }

  return null;
};

export default UserButtons;
