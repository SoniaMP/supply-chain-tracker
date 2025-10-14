import { Card, Container, Grid, Stack, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";

const AdminPanel = () => {
  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Stack spacing={4}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Total</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Pendiente</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Aprobados</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Card sx={{ p: 4 }}>
              <Typography>Rechazados</Typography>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ p: 4 }}>
          <Stack spacing={1} alignItems="start">
            <Stack direction="row" spacing={2} alignItems="center">
              <PeopleIcon />
              <Typography variant="h6">Gestión de usuarios</Typography>
            </Stack>
            <Typography variant="caption">
              Permite controlar usuarios y gestionar sus permisos asociados
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default AdminPanel;
