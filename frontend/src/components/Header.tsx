import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link } from "react-router-dom";

import { useWallet } from "../hooks/useWallet";

const Header = () => {
  const { account, isConnecting, connectWallet, disconnectWallet } =
    useWallet();

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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Inicio
            </Button>
            <Button
              color="inherit"
              onClick={disconnectWallet}
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>
          </Box>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
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
