import { useEffect, useState } from "react";
import {
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

const AdminPanel = () => {
  const [accounts, setAccounts] = useState<IAccountInfo[]>([]);
  const { getAllAccounts } = useAccessManager();

  console.log("Accounts in AdminPanel:", accounts);

  useEffect(() => {
    async function fetchData() {
      const accounts = await getAllAccounts();
      setAccounts(accounts);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      <Stack spacing={1} alignItems="flex-start">
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                        >
                          <Typography variant="body2">
                            User #{idx + 1}
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
