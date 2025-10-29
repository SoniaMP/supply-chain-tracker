import React from "react";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import GroupRemoveIcon from "@mui/icons-material/GroupRemoveOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import { AccountStatus, IAccountInfo } from "../../interfaces";

const SummaryContainer = ({
  title,
  total,
  caption,
  color,
  icon,
}: {
  title: string;
  total: number;
  caption?: string;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  icon?: React.ElementType;
}) => {
  const Icon = icon;
  return (
    <Grid size={{ xs: 12, md: 3 }}>
      <Card sx={{ p: 2 }}>
        <Stack spacing={1} textAlign="justify">
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ flexGrow: 1 }} fontWeight={700}>
              {title}
            </Typography>
            {Icon && <Icon size="small" sx={{ width: "1rem", opacity: 0.8 }} />}
          </Box>
          <Typography variant="h6" color={color}>
            {total}
          </Typography>
          {caption && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              {caption}
            </Typography>
          )}
        </Stack>
      </Card>
    </Grid>
  );
};

const Summary = ({ accounts = [] }: { accounts: IAccountInfo[] }) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer
        title="Total"
        total={accounts.length}
        icon={PeopleAltOutlinedIcon}
        caption="Total de cuentas registradas"
      />
      <SummaryContainer
        title="Pendiente"
        total={
          accounts.filter((account) => account.status === AccountStatus.Pending)
            .length
        }
        icon={GroupAddOutlinedIcon}
        color="warning"
        caption="Cuentas pendientes de aprobación"
      />
      <SummaryContainer
        title="Aprobados"
        total={
          accounts.filter(
            (account) => account.status === AccountStatus.Approved
          ).length
        }
        color="success"
        icon={HowToRegOutlinedIcon}
        caption="Cuentas aprobadas y activas"
      />
      <SummaryContainer
        title="Rechazados"
        total={
          accounts.filter(
            (account) => account.status === AccountStatus.Rejected
          ).length
        }
        icon={GroupRemoveIcon}
        caption="Cuentas rechazadas"
        color="error"
      />
    </Grid>
  );
};

export default Summary;
