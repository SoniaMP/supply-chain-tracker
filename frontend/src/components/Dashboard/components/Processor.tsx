import {
  Button,
  Card,
  Chip,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AcceptIcon from "@mui/icons-material/ThumbUpAltOutlined";
import RejectIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { useEffect, useState } from "react";

import LoadingOverlay from "../../../layout/LoadingOverlay";
import { useTraceability } from "@hooks/useTraceability";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import { ITokenTransfer, mapTransferStatusToLabel } from "../../../interfaces";

const Processor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>([]);

  const { getTransfers, isServiceReady } = useTraceability();

  const refreshTokenTransfers = async () => {
    try {
      setIsLoading(true);
      const transfers = await getTransfers();
      setTokenTransfers(transfers);
    } catch (err) {
      console.error("Error loading transfers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isServiceReady) refreshTokenTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  const handleReject = async (id: number) => {
    console.log("Rejecting transfer:", id);
    // TODO: await rejectTransfer(id)
  };

  const handleAccept = async (id: number) => {
    console.log("Accepting transfer:", id);
    // TODO: await acceptTransfer(id)
  };

  return (
    <Container sx={{ py: 2 }} maxWidth="lg">
      <LoadingOverlay loading={isLoading} />
      <Stack spacing={3}>
        <Typography variant="h5">Historial de Transferencias</Typography>

        {tokenTransfers.length === 0 && !isLoading ? (
          <Card sx={{ p: 2 }}>
            <EmptySection message="No hay transferencias disponibles." />
          </Card>
        ) : (
          <TableContainer component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Token</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Origen</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Destino</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Cantidad</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokenTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>#{transfer.id}</TableCell>
                    <TableCell>Token #{transfer.tokenId}</TableCell>
                    <TableCell>
                      <AddressInfo address={transfer.from} />
                    </TableCell>
                    <TableCell>
                      <AddressInfo address={transfer.to} />
                    </TableCell>
                    <TableCell align="center">{transfer.amount}</TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        color={
                          transfer.status === 1
                            ? "warning"
                            : transfer.status === 2
                            ? "success"
                            : transfer.status === 3
                            ? "error"
                            : "default"
                        }
                        label={mapTransferStatusToLabel[transfer.status]}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {transfer.status === 1 ? ( // Pending
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={() => handleReject(transfer.id)}
                          >
                            Rechazar
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<AcceptIcon />}
                            onClick={() => handleAccept(transfer.id)}
                          >
                            Aceptar
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
};

export default Processor;
