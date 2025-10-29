import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";

import { useAccessManager } from "@hooks/useAccessManager";

import { IAccountInfo } from "../../interfaces";
import Summary from "./Summary";
import LoadingOverlay from "../../layout/LoadingOverlay";
import UsersTable from "./UsersTable";

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
      <LoadingOverlay loading={isLoading} />

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h5">Panel de Administración</Typography>

          <Typography variant="body1">
            Gestión de usuarios registrados en la plataforma
          </Typography>
        </Stack>

        <Summary accounts={accounts} />

        <Card sx={{ p: 1 }}>
          <CardHeader
            title={
              <Stack direction="row" spacing={2} alignItems="center">
                <PeopleIcon />
                <Typography variant="h6">Gestión de usuarios</Typography>
              </Stack>
            }
          />

          <CardContent>
            <Stack spacing={1} alignItems="start">
              <Typography variant="caption">
                Permite controlar usuarios y gestionar sus permisos asociados
              </Typography>

              {accounts.length && (
                <UsersTable
                  accounts={accounts}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default AdminPanel;
