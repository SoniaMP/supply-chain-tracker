import { FormEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const RewardTokenForm = ({ open, onClose, onSubmit }: any) => {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const currentAddress = address.trim();
    const amt = String(amount).trim();

    if (!currentAddress) {
      alert("Dirección destino es obligatoria");
      return;
    }
    if (!amt) {
      alert("Cantidad es obligatoria");
      return;
    }

    setAddress("");
    setAmount("");
    onSubmit(currentAddress, Number(amt));
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="reward-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="reward-dialog-title">Enviar Reward Token</DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Dirección destino"
            name="to"
            value={address}
            onChange={(e: any) => setAddress(e.target.value)}
            required
            fullWidth
            margin="dense"
            placeholder="0x..."
          />

          <TextField
            label="Cantidad"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            fullWidth
            margin="dense"
            type="number"
            placeholder="0.0"
          />
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
          <Button type="button" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RewardTokenForm;
