import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface TransferTokenFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (address: string, amount: number) => void;
}

const TransferTokenForm = ({
  open,
  onClose,
  onSubmit,
}: TransferTokenFormProps) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ address?: string; amount?: string }>(
    {}
  );

  const validate = () => {
    const next: { address?: string; amount?: string } = {};
    const addr = address.trim();
    const amt = Number(amount);

    if (!addr) next.address = "La dirección es obligatoria";
    else if (!/^0x[a-fA-F0-9]{40}$/.test(addr))
      next.address = "Dirección no válida (formato 0x...)";

    if (!amount.toString().trim()) next.amount = "La cantidad es obligatoria";
    else if (Number.isNaN(amt) || amt <= 0)
      next.amount = "Introduce una cantidad mayor que 0";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(address, Number(amount));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Transferir token</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          <TextField
            label="Dirección destino"
            placeholder="0x..."
            fullWidth
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={Boolean(errors.address)}
            helperText={errors.address}
            autoFocus
          />

          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferTokenForm;
