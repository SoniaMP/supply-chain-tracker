import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";

import { useAccessManager } from "@hooks/useAccessManager";

import {
  AccountStatus,
  IAccountInfo,
  mapRoleToLabel,
  mapStatusToLabel,
} from "../../interfaces";
import UserActions from "./UserActions";

const AdminPanel = () => {
  const [accounts, setAccounts] = useState<IAccountInfo[]>([]);
  const { isServiceReady, approveRole, getAllAccounts } = useAccessManager();

  console.log("Accounts in AdminPanel:", accounts);

  useEffect(() => {
    if (!isServiceReady) return;

    async function fetchData() {
      const accounts = await getAllAccounts();
      setAccounts(accounts);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  function getChipStatusColor(status: number) {
    switch (status) {
      case AccountStatus.Approved:
        return "success";
      case AccountStatus.Rejected:
        return "error";
      case AccountStatus.Pending:
        return "warning";
      default:
        return "default";
    }
  }

  function handleApprove(account: string) {
    console.log(`Approve account: ${account}`);
    approveRole?.(account);
  }

  function handleReject(account: string) {
    console.log(`Reject account: ${account}`);
    // Lógica para rechazar la cuenta
  }
  function handleSetPending(account: string) {
    console.log(`Set account to pending: ${account}`);
    // Lógica para establecer la cuenta como pendiente
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Stack spacing={4}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Total</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Pendiente</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Aprobados</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Rechazados</Typography>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ p: 4 }}>
          <Stack spacing={1} alignItems="start">
            <Stack direction="row" spacing={2} alignItems="center">
              <PeopleIcon />
              <Typography variant="h6">Gestión de usuarios</Typography>
            </Stack>

            <Typography variant="caption">
              Permite controlar usuarios y gestionar sus permisos asociados
            </Typography>

            {accounts.length && (
              <List sx={{ width: "100%" }} disablePadding>
                {accounts.map(({ account, role, status }, idx: number) => (
                  <ListItem key={account} sx={{ p: 0 }}>
                    <Card
                      sx={{
                        p: 2,
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <ListItemAvatar>
                        <PeopleIcon />
                      </ListItemAvatar>
                      <Stack spacing={1} alignItems="flex-start" width="100%">
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          width="100%"
                        >
                          <Typography variant="body2">
                            Usuario #{idx + 1}
                          </Typography>
                          <Chip
                            label={mapRoleToLabel[role]}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={mapStatusToLabel[status]}
                            size="small"
                            color={getChipStatusColor(status)}
                          />
                          <Box flexGrow={1} display="flex">
                            <UserActions
                              onPending={() => handleSetPending(account)}
                              onApprove={() => handleApprove(account)}
                              onReject={() => handleReject(account)}
                            />
                          </Box>
                        </Stack>
                        <Typography sx={{ fontFamily: "monospace" }}>
                          {account}
                        </Typography>
                      </Stack>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default AdminPanel;
