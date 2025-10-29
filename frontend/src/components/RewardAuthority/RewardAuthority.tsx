import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Stack,
  Container,
  Chip,
} from "@mui/material";
import AwardIcon from "@mui/icons-material/EmojiEventsOutlined";
import AcceptIcon from "@mui/icons-material/ThumbUpAltOutlined";
import RejectIcon from "@mui/icons-material/ThumbDownAltOutlined";

import { useWallet } from "@context/metamask/provider";
import { useTraceability } from "@hooks/useTraceability";
import TokensTable from "@components/Token/TokensTable";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import RewardTokenForm from "@components/Token/RewardTokenForm";
import {
  ITokenInfo,
  ITokenTransfer,
  mapTransferStatusToLabel,
  TokenStage,
  TransferStatus,
} from "../../interfaces";
import LoadingOverlay from "../../layout/LoadingOverlay";

const RewardAuthority = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState<ITokenTransfer[]>(
    []
  );
  const [ownedTokens, setOwnedTokens] = useState<ITokenInfo[]>([]);
  const [rewardedTokens, setRewardedTokens] = useState<ITokenInfo[]>([]);

  const { account } = useWallet();
  const {
    acceptTransfer,
    getAllTokens,
    getRewardedTokens,
    getTransfers,
    isServiceReady,
    rejectTransfer,
    rewardToken,
  } = useTraceability();

  const refresh = async () => {
    setIsLoading(true);

    const [allTransfers, allTokens, rewardedTokens] = await Promise.all([
      getTransfers(),
      getAllTokens(),
      getRewardedTokens(),
    ]);

    console.log("Rewarded tokens fetched:", rewardedTokens);

    const regulatorTokens = allTokens.filter(
      (t: ITokenInfo) =>
        t.currentHolder.toLowerCase() === account?.toLowerCase() &&
        t.stage === TokenStage.Processed
    );

    const pendingTransfers = allTransfers.filter(
      (tr: ITokenTransfer) =>
        tr.to.toLowerCase() === account?.toLowerCase() &&
        tr.status === TransferStatus.Pending
    );

    setPendingTransfers(pendingTransfers);
    setOwnedTokens(regulatorTokens);
    setRewardedTokens(rewardedTokens);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isServiceReady) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isServiceReady]);

  const handleReward = async (to: string, amount: number) => {
    if (!rewardToken || tokenId === null) return;

    try {
      setIsLoading(true);
      console.log("Rewarding citizen for token ID:", tokenId);
      await rewardToken(tokenId, amount);
      await refresh();
    } catch (err) {
      console.error("Error rewarding citizen:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (transferId: number) => {
    if (!rejectTransfer) return;

    try {
      setIsLoading(true);
      await rejectTransfer(transferId);
      await refresh();
    } catch (err) {
      console.error("Error rejecting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (transferId: number) => {
    if (!acceptTransfer) return;

    try {
      setIsLoading(true);
      await acceptTransfer(transferId);
      await refresh();
    } catch (err) {
      console.error("Error accepting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  function handleShowTransferDialog(tokenId: number) {
    setTokenId(tokenId);
    setShowTransferDialog(true);
  }

  return (
    <Container sx={{ py: 2 }} maxWidth="lg">
      <LoadingOverlay loading={isLoading} />
      <Stack spacing={4}>
        <Card>
          <CardHeader title="Tokens recibidos (pendientes de recompensa)" />
          <CardContent>
            {pendingTransfers.length === 0 && !isLoading ? (
              <EmptySection message="No hay transferencias disponibles." />
            ) : (
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
                  {pendingTransfers.map((transfer) => (
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Pendiente de emitir recompensa" />
          <TokensTable
            tokens={ownedTokens}
            label="Recompensar"
            startIcon={<AwardIcon />}
            onClick={handleShowTransferDialog}
          />
        </Card>

        <Card>
          <CardHeader title="Tokens recompensados" />
          <CardContent>
            {rewardedTokens.length === 0 ? (
              <Typography color="text.secondary">
                Aún no se ha recompensado ningún token.
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Ciudadano</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewardedTokens.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.creator}</TableCell>
                      <TableCell>
                        {new Date(t.dateCreated * 1000).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Stack>

      {showTransferDialog && (
        <RewardTokenForm
          open={showTransferDialog}
          onClose={() => setShowTransferDialog(false)}
          onSubmit={handleReward}
        />
      )}
    </Container>
  );
};

export default RewardAuthority;
