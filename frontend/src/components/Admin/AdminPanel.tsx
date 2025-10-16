import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
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
import Summary from "./Summary";
import LoadingOverlay from "../../layout/LoadingOverlay";

const AdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<IAccountInfo[]>([]);
  const { isServiceReady, approveAccount, rejectAccount, getAllAccounts } =
    useAccessManager();

  useEffect(() => {
    if (!isServiceReady) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const accounts = await getAllAccounts();
        setAccounts(accounts);
      } catch (err) {
        alert(`Error al cargar las cuentas: ${err}`);
      } finally {
        setIsLoading(false);
      }
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

  async function handleApprove(account: string) {
    try {
      setIsLoading(true);
      await approveAccount?.(account);
      const updatedAccounts = await getAllAccounts();
      setAccounts(updatedAccounts);
    } catch (err) {
      alert(`Error al aprobar la cuenta: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReject(account: string) {
    try {
      setIsLoading(true);
      await rejectAccount?.(account);
      const updatedAccounts = await getAllAccounts();
      setAccounts(updatedAccounts);
    } catch (err) {
      alert(`Error al aprobar la cuenta: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Stack spacing={4}>
        <Summary accounts={accounts} />

        <Card sx={{ p: 4 }}>
          <LoadingOverlay loading={isLoading} />
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
                  <ListItem key={account} sx={{ py: 0.5 }}>
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
