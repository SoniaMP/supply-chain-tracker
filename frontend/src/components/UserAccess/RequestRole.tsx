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

import { useAccessManager } from "@hooks/useAccessManager";
import { CardLayout } from "../../layouts";
import { UserRole } from "../../interfaces";

const RequestRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const { requestRole } = useAccessManager();

  function handleRequestRole() {
    console.log("Solicitud de rol:", role);
    requestRole(role!).catch((err) => {
      console.error("Error al solicitar el rol:", err);
      alert(`Error al solicitar el rol: ${err.message}`);
    });
  }

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
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <MenuItem value={UserRole.CONSUMER}>Consumidor</MenuItem>
          <MenuItem value={UserRole.PRODUCER}>Productor</MenuItem>
          <MenuItem value={UserRole.RETAILER}>Minorista</MenuItem>
          <MenuItem value={UserRole.FACTORY}>Mayorista</MenuItem>
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

        <Button
          disabled={!role}
          fullWidth
          startIcon={<ArrowRight />}
          onClick={handleRequestRole}
        >
          Solicitar acceso
        </Button>
      </Stack>
    </CardLayout>
  );
};

export default RequestRole;
