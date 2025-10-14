import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";

import { useGlobal } from "@context/global/provider";
import { useWallet } from "@context/metamask/provider";
import { HeaderChip } from "../styled";
import { formatAddress } from "../../utils/helpers";
import RoleButtons from "./RoleButtons";

const mapRoleToLabel: Record<string, string> = {
  ADMIN: "Admin",
  CONSUMER: "Consumer",
  RETAILER: "Retailer",
  FACTORY: "Factory",
  PRODUCER: "Producer",
};

const Header = () => {
  const navigate = useNavigate();
  const {
    account,
    isConnecting,
    isMetamaskInstalled,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const { userInfo } = useGlobal();

  function handleNavigateDashboard() {
    navigate("/dashboard");
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WalletIcon />
          <Typography variant="h6">Supply Chain Tracker</Typography>
        </Box>

        {account ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack spacing={0.5} direction="row" alignItems="center">
              <AccountIcon />
              {userInfo?.role && (
                <Typography variant="caption">
                  {mapRoleToLabel[userInfo.role]}
                </Typography>
              )}
            </Stack>
            <Tooltip title={account} arrow>
              <HeaderChip
                label={formatAddress(account)}
                size="medium"
                variant="outlined"
              />
            </Tooltip>
            <Button
              startIcon={<DashboardIcon />}
              onClick={handleNavigateDashboard}
            >
              Dashboard
            </Button>
            <RoleButtons />
            <Button
              variant="outlined"
              color="inherit"
              onClick={disconnectWallet}
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>
          </Stack>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={!isMetamaskInstalled || isConnecting}
            loading={isConnecting}
            startIcon={<WalletIcon />}
          >
            {isConnecting ? "Conectando..." : "Conectar Wallet"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
