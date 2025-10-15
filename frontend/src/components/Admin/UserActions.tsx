import BlockIcon from "@mui/icons-material/BlockOutlined";
import DoneIcon from "@mui/icons-material/DoneOutlined";
import MoreIcon from "@mui/icons-material/MoreVertOutlined";
import WatchIcon from "@mui/icons-material/WatchLaterOutlined";
import { IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface UserActionsProps {
  onPending: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const UserActions = ({ onPending, onApprove, onReject }: UserActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton
        sx={{ marginLeft: "auto" }}
        onClick={handleClick}
        aria-describedby={id}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={onPending}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WatchIcon fontSize="small" />
            <Typography>Cambiar a pendiente</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={onApprove}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DoneIcon fontSize="small" />
            <Typography>Aprobar</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={onReject}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BlockIcon fontSize="small" />
            <Typography>Rechazar</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserActions;
