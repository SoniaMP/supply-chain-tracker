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
import PropaneIcon from "@mui/icons-material/PropaneTankOutlined";
import { useEffect, useState } from "react";

import LoadingOverlay from "../../layout/LoadingOverlay";
import { useTraceability } from "@hooks/useTraceability";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import { ITokenTransfer, mapTransferStatusToLabel } from "../../interfaces";
import { useWallet } from "@context/metamask/provider";
import TransferTokenForm from "@components/Token/TransferTokenForm";

const Processor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [isProcessTokenFormOpen, setProcessTokenFormOpen] = useState(false);
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>([]);
  const { account } = useWallet();

  console.log("Token Transfers:", tokenTransfers);

  const {
    acceptTransfer,
    rejectTransfer,
    getTransfers,
    processToken,
    transfer,
    isServiceReady,
  } = useTraceability();

  const refreshTokenTransfers = async () => {
    try {
      setIsLoading(true);
      const transfers = await getTransfers();
      const myTransfers = transfers.filter(
        (t) => t.to.toLowerCase() === account?.toLowerCase()
      );
      setTokenTransfers(myTransfers);
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

  const handleReject = async (tokenId: number) => {
    if (!rejectTransfer) return;

    try {
      setIsLoading(true);
      await rejectTransfer(tokenId);
      await refreshTokenTransfers();
    } catch (err) {
      console.error("Error rejecting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (tokenId: number) => {
    if (!acceptTransfer) return;

    try {
      setIsLoading(true);
      await acceptTransfer(tokenId);
      await refreshTokenTransfers();
    } catch (err) {
      console.error("Error accepting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (
    to: string,
    amount: number,
    features: string
  ) => {
    if (!transfer || !processToken || tokenId === null) return;

    try {
      setIsLoading(true);
      await processToken(tokenId, features);
      await transfer(tokenId, to, amount);
      await refreshTokenTransfers();
    } catch (err) {
      console.error("Error processing token:", err);
    } finally {
      setIsLoading(false);
    }
  };

  function handleShowProcessTokenForm(tokenId: number) {
    setTokenId(tokenId);
    setProcessTokenFormOpen(true);
  }

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
                      {transfer.status === 1 && (
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
                      )}
                      {transfer.status === 2 && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<PropaneIcon />}
                          onClick={() =>
                            handleShowProcessTokenForm(transfer.id)
                          }
                        >
                          Procesar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
      <TransferTokenForm
        enableFeatures
        open={isProcessTokenFormOpen}
        onClose={() => setProcessTokenFormOpen(false)}
        onSubmit={handleProcess}
      />
    </Container>
  );
};

export default Processor;
