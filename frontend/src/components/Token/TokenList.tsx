import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PropaneIcon from "@mui/icons-material/PropaneTankOutlined";

import { ITokenInfo, mapTokenStageToLabel, TokenStage } from "../../interfaces";

const TokenList = ({
  tokens,
  onAddToken,
  onViewDetails,
}: {
  tokens: ITokenInfo[];
  onAddToken: () => void;
  onViewDetails: (token: ITokenInfo) => void;
}) => {
  return (
    <Stack spacing={1}>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddToken}>
          Agregar Token
        </Button>
      </Box>
      <Typography variant="body1">
        {tokens.length} tokens encontrados
      </Typography>
      <Grid container spacing={1}>
        {tokens.map((token, index) => (
          <Grid size={{ xs: 3 }} key={`token.${token.creator}-${token.name}`}>
            <Card>
              <CardHeader
                title={
                  <Box display="flex" justifyContent="space-between">
                    <Stack direction="column" alignItems="flex-start">
                      <Typography variant="body1" fontWeight="fontWeightBold">
                        {token.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Token #{index + 1}
                      </Typography>
                    </Stack>
                    <Chip
                      label={mapTokenStageToLabel[token.stage]}
                      color={
                        token.stage === TokenStage.Created ||
                        token.stage === TokenStage.Rewarded
                          ? "success"
                          : "warning"
                      }
                      variant="filled"
                      size="small"
                    />
                  </Box>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid>
                      <Stack direction="column">
                        <Typography variant="caption" fontWeight={600}>
                          Total
                        </Typography>
                        <Typography variant="body2">
                          {token.totalSupply} gr.
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <Stack direction="column">
                        <Typography variant="caption" fontWeight={600}>
                          Fecha creación
                        </Typography>
                        <Typography variant="body2">
                          {new Date(
                            token.dateCreated * 1000
                          ).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Stack direction="column">
                        <Typography variant="caption" fontWeight={600}>
                          Características
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Button
                    variant="outlined"
                    onClick={() => onViewDetails(token)}
                    startIcon={<PropaneIcon />}
                  >
                    Ver detalles
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default TokenList;
