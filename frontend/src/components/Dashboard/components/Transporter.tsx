import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowOutIcon from "@mui/icons-material/ArrowOutwardOutlined";
import ArrowInIcon from "@mui/icons-material/SouthEastOutlined";

import { useTraceability } from "@hooks/useTraceability";
import LoadingOverlay from "../../../layout/LoadingOverlay";
import { ITokenInfo, TokenStage } from "../../../interfaces";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";

const QuantityInfo = ({ amount }: { amount: number }) => (
  <Typography variant="body2" color="text.secondary">
    Cantidad: {amount} gr.
  </Typography>
);

interface TokenSectionProps {
  title: string;
  tokens: ITokenInfo[];
  actionLabel: string;
  actionIcon?: React.ReactNode;
  actionVariant?: "contained" | "outlined";
  onAction: (id: number) => void;
}

const TokenSection: React.FC<TokenSectionProps> = ({
  title,
  tokens,
  actionLabel,
  actionIcon,
  actionVariant = "contained",
  onAction,
}) => (
  <Stack spacing={1}>
    <Typography variant="h6">{title}</Typography>
    <Grid container spacing={2}>
      {tokens.length ? (
        tokens.map((t) => (
          <Grid size={{ xs: 12, md: 6, lg: 3 }} key={t.id}>
            <Card sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">{t.name}</Typography>
                <AddressInfo label="Ciudadano" address={t.creator} />
                <QuantityInfo amount={t.totalSupply} />
                <Button
                  fullWidth
                  variant={actionVariant}
                  startIcon={actionIcon}
                  onClick={() => onAction(t.id)}
                >
                  {actionLabel}
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))
      ) : (
        <EmptySection message="No hay reciclaje pendiente de recogida" />
      )}
    </Grid>
  </Stack>
);

const Transporter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<ITokenInfo[]>([]);

  const { collectToken, getAllTokens, isServiceReady } = useTraceability();

  const refreshTokens = async () => {
    const all = await getAllTokens();
    const filtered = all.filter(
      (t: ITokenInfo) =>
        t.stage === TokenStage.Created || t.stage === TokenStage.Collected
    );
    setTokens(filtered);
  };

  useEffect(() => {
    if (isServiceReady) refreshTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  async function handleCollect(tokenId: number) {
    if (!collectToken) return;
    try {
      setIsLoading(true);
      await collectToken(tokenId);
      await refreshTokens();
    } catch (err) {
      console.error("Error collecting token:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const createdTokens = tokens.filter((t) => t.stage === TokenStage.Created);
  const collectedTokens = tokens.filter(
    (t) => t.stage === TokenStage.Collected
  );

  return (
    <Container sx={{ py: 2 }} maxWidth="lg">
      <LoadingOverlay loading={isLoading} />
      <Stack spacing={3}>
        <TokenSection
          title="Por recolectar"
          tokens={createdTokens}
          actionLabel="Recoger"
          actionIcon={<ArrowInIcon />}
          onAction={handleCollect}
        />

        <TokenSection
          title="Recolectados"
          tokens={collectedTokens}
          actionLabel="Enviar"
          actionIcon={<ArrowOutIcon />}
          actionVariant="outlined"
          onAction={(id) => alert(`Enviar token con ID: ${id}`)}
        />
      </Stack>
    </Container>
  );
};

export default Transporter;
