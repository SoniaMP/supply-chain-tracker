import { Card, Grid, Typography } from "@mui/material";

import { AccountStatus, IAccountInfo } from "../../interfaces";

const SummaryContainer = ({
  title,
  total,
  color,
}: {
  title: string;
  total: number;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}) => {
  return (
    <Grid size={{ xs: 3 }}>
      <Card sx={{ p: 2 }}>
        <Typography>{title}</Typography>
        <Typography variant="h6" color={color}>
          {total}
        </Typography>
      </Card>
    </Grid>
  );
};

const Summary = ({ accounts = [] }: { accounts: IAccountInfo[] }) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer title="Total" total={accounts.length} />
      <SummaryContainer
        title="Pendiente"
        total={
          accounts.filter((account) => account.status === AccountStatus.Pending)
            .length
        }
        color="warning"
      />
      <SummaryContainer
        title="Aprobados"
        total={
          accounts.filter(
            (account) => account.status === AccountStatus.Approved
          ).length
        }
        color="success"
      />
      <SummaryContainer
        title="Rechazados"
        total={
          accounts.filter(
            (account) => account.status === AccountStatus.Rejected
          ).length
        }
        color="error"
      />
    </Grid>
  );
};

export default Summary;
