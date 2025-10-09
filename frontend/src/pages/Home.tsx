import {
  Typography,
  Container,
  Card,
  Box,
  Button,
  Stack,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ShieldOk from "@mui/icons-material/GppGoodOutlined";
import HubIcon from "@mui/icons-material/HubOutlined";
import LockIcon from "@mui/icons-material/LockOpenOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Home = () => {
  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <Card sx={{ p: 4 }}>
        <Stack direction="column" spacing={2} alignItems="center">
          <WalletIcon />
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Conecta tu cuenta
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Conecta con MetaMask para acceder al portal y gestionar la cadena de
            suministro.
          </Typography>
          <Button variant="contained" startIcon={<WalletIcon />}>
            <Typography variant="body1">Conecta con MetaMask</Typography>
          </Button>
          <Card sx={{ p: 2 }}>
            <Typography variant="body1" fontWeight={"bold"}>
              ¿Por qué usar tu wallet?
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ShieldOk />
                </ListItemIcon>
                <ListItemText
                  primary="Seguridad"
                  secondary="Tu wallet es la forma más segura de gestionar tus activos."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HubIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Descentralización"
                  secondary="Controla tus datos y transacciones sin intermediarios."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Control total"
                  secondary="Eres el único dueño de tus activos y decisiones."
                />
              </ListItem>
            </List>
          </Card>
          <Box>
            <Typography variant="body2" color="textSecondary">
              ¿No tienes una cuenta?{" "}
              <Link
                href="https://metamask.io/download.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descarga MetaMask aquí
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Container>
  );
};

export default Home;
