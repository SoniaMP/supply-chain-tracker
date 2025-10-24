import { Chip, Stack, Typography } from "@mui/material";
import { formatAddress } from "@utils/helpers";

const AddressInfo = ({
  label,
  address,
}: {
  label?: string;
  address: string;
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {label && (
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    )}
    <Chip variant="outlined" size="small" label={formatAddress(address)} />
  </Stack>
);

export default AddressInfo;
