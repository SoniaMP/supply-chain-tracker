import { useState } from "react";
import LockIcon from "@mui/icons-material/LockOpenOutlined";
import ArrowRight from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { CardLayout } from "../layouts";
import { EUserRole } from "../interfaces";

const RequestRole = () => {
  const [role, setRole] = useState<EUserRole | null>(null);

  return (
    <CardLayout>
      <Stack direction="column" spacing={2} alignItems="center">
        <LockIcon />

        <Typography variant="h5" gutterBottom>
          Registra tu acceso
        </Typography>

        <Stack>
          <Typography variant="body1">
            Selecciona tu rol en la cadena de suministro
          </Typography>
          <Typography variant="caption">
            El administrador del sistema revisará tu solicitud
          </Typography>
        </Stack>

        <Select
          fullWidth
          value={role}
          sx={{ padding: 0 }}
          onChange={(e) => setRole(e.target.value as EUserRole)}
        >
          <MenuItem value={EUserRole.MANUFACTURER}>Fabricante</MenuItem>
          <MenuItem value={EUserRole.DISTRIBUTOR}>Distribuidor</MenuItem>
          <MenuItem value={EUserRole.RETAILER}>Minorista</MenuItem>
          <MenuItem value={EUserRole.CONSUMER}>Consumidor</MenuItem>
        </Select>

        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: "justify",
            backgroundColor: (theme) => theme.palette.grey[100],
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            Descripción roles
          </Typography>
          <Typography variant="body2">
            <strong>Fabricante:</strong> Crea y produce productos, iniciando su
            viaje en la cadena de suministro.
          </Typography>
          <Typography variant="body2">
            <strong>Distribuidor:</strong> Gestiona la logística y distribución
            de productos desde los fabricantes hasta los minoristas.
          </Typography>
          <Typography variant="body2">
            <strong>Minorista:</strong> Vende productos directamente a los
            consumidores finales.
          </Typography>
          <Typography variant="body2">
            <strong>Consumidor:</strong> Compra y utiliza los productos,
            cerrando el ciclo de la cadena de suministro.
          </Typography>
        </Box>

        <Button disabled={!role} fullWidth startIcon={<ArrowRight />}>
          Solicitar acceso
        </Button>
      </Stack>
    </CardLayout>
  );
};

export default RequestRole;
