import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { HeaderChip } from "./styled";
import { formatAddress } from "../utils";
import { useWallet } from "../providers/metamask/provider";

const Header = () => {
  const {
    account,
    isConnecting,
    isMetamaskInstalled,
    connectWallet,
    disconnectWallet,
  } = useWallet();

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
            <Tooltip title={account} arrow>
              <HeaderChip
                label={formatAddress(account)}
                size="medium"
                variant="outlined"
              />
            </Tooltip>
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
