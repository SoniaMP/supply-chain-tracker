import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Stack,
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
    setIsLoading(true);
    const transfers = await getTransfers();
    setTokenTransfers(transfers);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isServiceReady) refreshTokenTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  function handleReject(transferId: number) {
    // Implement rejection logic here
    console.log("Rejecting transfer with ID:", transferId);
  }

  function handleAccept(transferId: number) {
    // Implement acceptance logic here
    console.log("Accepting transfer with ID:", transferId);
  }

  return (
    <Container sx={{ py: 2 }} maxWidth="lg">
      <LoadingOverlay loading={isLoading} />
      <Stack spacing={3}>
        <Typography variant="h5">Historial de Transferencias</Typography>
        {tokenTransfers.length === 0 && !isLoading && (
          <Card sx={{ p: 2 }}>
            <EmptySection message="No hay transferencias disponibles." />
          </Card>
        )}
        {tokenTransfers.length > 0 && (
          <Grid container spacing={2}>
            {tokenTransfers.map((transfer) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={transfer.id}>
                <Card sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" sx={{ flex: 1 }}>
                        Token #{transfer.tokenId}
                      </Typography>
                      <Chip label={mapTransferStatusToLabel[transfer.status]} />
                    </Box>
                    <AddressInfo label="Origen" address={transfer.from} />
                    <AddressInfo label="Destino" address={transfer.to} />
                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<RejectIcon />}
                        onClick={() => handleReject(transfer.id)}
                      >
                        Rechazar
                      </Button>
                      <Button
                        fullWidth
                        startIcon={<AcceptIcon />}
                        onClick={() => handleAccept(transfer.id)}
                      >
                        Aceptar
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
};

export default Processor;
