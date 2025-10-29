import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
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
import ArrowInIcon from "@mui/icons-material/SouthEastOutlined";

import { useTraceability } from "@hooks/useTraceability";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import { useWallet } from "@context/metamask/provider";
import QuantityInfo from "@components/common/QuantityInfo";
import LoadingOverlay from "../../layout/LoadingOverlay";
import {
  ITokenInfo,
  ITokenTransfer,
  mapTokenStageToLabel,
  TokenStage,
  TransferStatus,
} from "../../interfaces";
import TransferTokenForm from "../Token/TransferTokenForm";
import TokensTable from "@components/Token/TokensTable";
import Summary from "./Summary";

const Transporter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [transfers, setTransfers] = useState<ITokenTransfer[]>([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [pendingTokens, setPendingTokens] = useState<ITokenInfo[]>([]);
  const [collectedTokens, setCollectedTokens] = useState<ITokenInfo[]>([]);
  const [ownedTokens, setOwnedTokens] = useState<ITokenInfo[]>([]);

  const { account } = useWallet();
  const {
    collectToken,
    transfer,
    getAllTokens,
    getCollectedTokens,
    getTransfers,
    isServiceReady,
  } = useTraceability();

  const refresh = async () => {
    setIsLoading(true);

    const [allTokens, allTransfers, collectedTokens] = await Promise.all([
      getAllTokens(),
      getTransfers(),
      getCollectedTokens(),
    ]);

    // Transfers activas (pendientes) creadas por el transportista
    const transporterTransfers = allTransfers.filter(
      (tr: any) =>
        tr.from.toLowerCase() === account?.toLowerCase() &&
        tr.status === TransferStatus.Pending
    );

    const activeTransferTokenIds = transporterTransfers.map(
      (tr: any) => tr.tokenId
    );

    // Filtramos los tokens en posesión que NO estén en una transferencia activa
    const availableTokens = allTokens.filter(
      (t: any) =>
        t.currentHolder.toLowerCase() === account?.toLowerCase() &&
        !activeTransferTokenIds.includes(t.id)
    );

    // Tokens que posee actualmente el transportista
    const ownedTokens = availableTokens.filter(
      (t: any) => t.currentHolder.toLowerCase() === account?.toLowerCase()
    );

    const pendingTokens = allTokens.filter(
      (t: ITokenInfo) => t.stage === TokenStage.Created
    );

    console.log("Collected tokens for transporter:", collectedTokens);
    setPendingTokens(pendingTokens);
    setOwnedTokens(ownedTokens);
    setTransfers(transporterTransfers);
    setCollectedTokens(collectedTokens);
    setIsLoading(false);
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
        <Summary
          pendingTokens={pendingTokens.length}
          ownedTokens={ownedTokens.length}
          collectedTokens={collectedTokens.length}
          transferedTokens={transfers.length}
        />
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Grid size={{ xs: 6 }}>
            <Card>
              <CardHeader title="Tokens pendientes de recogida" />
              <CardContent>
                {pendingTokens.length ? (
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
                        {pendingTokens.map((t) => {
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
                                {mapTokenStageToLabel[t.stage]}
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  variant="contained"
                                  startIcon={<ArrowInIcon />}
                                  onClick={() => handleCollect(t.id)}
                                >
                                  Recoger
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <EmptySection message="No hay tokens para recoger" />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Card>
              <CardHeader title="Tokens en custodia" />
              <CardContent>
                <TokensTable tokens={ownedTokens} onClick={handleTransfer} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardHeader title="Historial de tokens recogidos" />
          <CardContent>
            <TokensTable tokens={collectedTokens} enableActions={false} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Historial de transferencias" />
          <CardContent>
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
                        <TableCell>🕓 Esperando centro procesamiento</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            ) : (
              <EmptySection message="No hay transferencias disponibles" />
            )}
          </CardContent>
        </Card>
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
