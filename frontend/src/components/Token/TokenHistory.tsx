import { useEffect, useState } from "react";

import {
  Avatar,
  Dialog,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import { useTraceability } from "@hooks/useTraceability";

import {
  ITokenHistoryEntry,
  ITokenInfo,
  mapTokenStageToLabel,
  TokenStage,
} from "../../interfaces";

const TokenHistory = ({
  token,
  onClose,
}: {
  token: ITokenInfo;
  onClose: () => void;
}) => {
  const [history, setHistory] = useState<ITokenHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isServiceReady, getTokenHistory } = useTraceability();

  useEffect(() => {
    if (!isServiceReady) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const tokenHistory = await getTokenHistory(token.id);
        setHistory(tokenHistory);
      } catch (err) {
        alert(`Error al cargar los tokens: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  console.log("Token history:", history);
  if (isLoading) return <p>Cargando historial...</p>;
  if (history.length === 0) return <p>No hay cambios de custodia.</p>;

  const getIcon = (stage: TokenStage) => {
    switch (stage) {
      case TokenStage.Created:
        return "🧍";
      case TokenStage.Collected:
        return "🚛";
      case TokenStage.Processed:
        return "🏭";
      case TokenStage.Rewarded:
        return "🏛️";
      default:
        return "📦";
    }
  };

  return (
    <Dialog open={true} fullWidth maxWidth="sm" onClose={onClose}>
      <Paper sx={{ p: 2, borderRadius: 2 }} elevation={1}>
        <Typography variant="h6" component="h3" gutterBottom>
          Historial de Custodia
        </Typography>

        <List>
          {history.map((h, i) => (
            <div key={i}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    sx={{ bgcolor: "primary.light", width: 40, height: 40 }}
                  >
                    {getIcon(h.action)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {mapTokenStageToLabel[h.action]} —{" "}
                      {h.newHolder.slice(0, 6)}...
                      {h.newHolder.slice(-4)}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {h.timestamp}
                      </Typography>
                      <Link
                        href={`https://sepolia.etherscan.io/tx/${h.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="caption"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        Ver transacción
                      </Link>
                    </>
                  }
                />
              </ListItem>

              {i < history.length - 1 && <Divider component="li" />}
            </div>
          ))}
        </List>
      </Paper>
    </Dialog>
  );
};

export default TokenHistory;
