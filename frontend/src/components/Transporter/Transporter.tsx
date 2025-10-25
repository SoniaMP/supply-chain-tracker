import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowOutIcon from "@mui/icons-material/ArrowOutwardOutlined";
import ArrowInIcon from "@mui/icons-material/SouthEastOutlined";

import { useTraceability } from "@hooks/useTraceability";
import LoadingOverlay from "../../layout/LoadingOverlay";
import { ITokenInfo, ITokenTransfer, TokenStage } from "../../interfaces";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import TransferTokenForm from "../Token/TransferTokenForm";
import { useWallet } from "@context/metamask/provider";

const QuantityInfo = ({ amount }: { amount: number }) => (
  <Typography variant="body2" color="text.secondary">
    Cantidad: {amount} gr.
  </Typography>
);

const Transporter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<ITokenInfo[]>([]);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [transfers, setTransfers] = useState<ITokenTransfer[]>([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const pendingTokenIds = new Set(transfers.map((tr) => tr.tokenId));

  const { account } = useWallet();
  const { collectToken, transfer, getAllTokens, getTransfers, isServiceReady } =
    useTraceability();

  const refreshTokens = async () => {
    const all = await getAllTokens();
    const allTokens = all.filter(
      (t: ITokenInfo) =>
        t.currentHolder.toLowerCase() === account?.toLowerCase() &&
        (t.stage === TokenStage.Created || t.stage === TokenStage.Collected)
    );
    setTokens(allTokens);
  };

  const refreshTransfers = async () => {
    const transfers = await getTransfers();
    const myTransfers = transfers.filter(
      (t: ITokenTransfer) =>
        (t.from === account || t.to === account) && t.status === 1
    );
    setTransfers(myTransfers);
  };

  const refresh = async () => {
    await refreshTokens();
    await refreshTransfers();
  };

  useEffect(() => {
    if (isServiceReady) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  async function handleCollect(tokenId: number) {
    if (!collectToken) return;

    try {
      setIsLoading(true);
      await collectToken(tokenId);
      await refresh();
    } catch (err) {
      console.error("Error collecting token:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTransfer(tokenId: number) {
    setTokenId(tokenId);
    setShowTransferDialog(true);
  }

  async function handleAcceptTransfer(to: string, amount: number) {
    if (tokenId === null || !transfer) return;

    try {
      setShowTransferDialog(false);
      setIsLoading(true);
      await transfer(tokenId, to, amount);
      await refresh();
    } catch (err) {
      console.error("Error transferring token:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container sx={{ py: 2 }} maxWidth="lg">
      <LoadingOverlay loading={isLoading} />

      <Stack spacing={3}>
        <Typography variant="h6" gutterBottom>
          Tokens
        </Typography>

        {tokens.length ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Ciudadano</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acción</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tokens.map((t) => {
                  const isPending = pendingTokenIds.has(t.id);

                  return (
                    <TableRow key={t.id} hover>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>
                        <AddressInfo label="" address={t.creator} />
                      </TableCell>
                      <TableCell>
                        <QuantityInfo amount={t.totalSupply} />
                      </TableCell>
                      <TableCell>
                        {t.stage === TokenStage.Created
                          ? "Por recolectar"
                          : t.stage === TokenStage.Collected
                          ? "Recolectado"
                          : t.stage}
                      </TableCell>
                      <TableCell align="right">
                        {t.stage === TokenStage.Created ? (
                          <Button
                            variant="contained"
                            startIcon={<ArrowInIcon />}
                            onClick={() => handleCollect(t.id)}
                          >
                            Recoger
                          </Button>
                        ) : t.stage === TokenStage.Collected ? (
                          <>
                            {isPending ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Envío pendiente...
                              </Typography>
                            ) : (
                              <Button
                                variant="outlined"
                                startIcon={<ArrowOutIcon />}
                                onClick={() => handleTransfer(t.id)}
                              >
                                Enviar
                              </Button>
                            )}
                          </>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptySection message="No hay tokens disponibles" />
        )}

        {transfers.length ? (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mt: 4 }}>
              Envíos pendientes de aceptación
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Transfer</TableCell>
                  <TableCell>Token ID</TableCell>
                  <TableCell>Procesador</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((tr) => (
                  <TableRow key={tr.id}>
                    <TableCell>{tr.id}</TableCell>
                    <TableCell>{tr.tokenId}</TableCell>
                    <TableCell>{tr.to.slice(0, 8)}…</TableCell>
                    <TableCell>{tr.amount}</TableCell>
                    <TableCell>🕓 Pendiente</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        ) : (
          <EmptySection message="No hay transferencias disponibles" />
        )}
      </Stack>

      {showTransferDialog && (
        <TransferTokenForm
          open={showTransferDialog}
          onClose={() => setShowTransferDialog(false)}
          onSubmit={handleAcceptTransfer}
        />
      )}
    </Container>
  );
};

export default Transporter;
