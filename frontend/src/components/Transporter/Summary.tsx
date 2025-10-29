import { Grid } from "@mui/material";

import SummaryContainer from "@components/common/SummaryContainer";

const Summary = ({
  pendingTokens = 0,
  ownedTokens = 0,
  collectedTokens = 0,
  transferedTokens = 0,
}: any) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer title="Pendiente recogida" total={pendingTokens} />
      <SummaryContainer title="Pendientes transporte" total={ownedTokens} />
      <SummaryContainer title="Recogidos" total={collectedTokens} />
      <SummaryContainer title="Enviados a procesar" total={transferedTokens} />
    </Grid>
  );
};

export default Summary;
