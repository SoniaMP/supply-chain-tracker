import { Box, Typography } from "@mui/material";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

const EmptySection = ({ message = "" }) => (
  <Box
    sx={{
      width: "100%",
      textAlign: "center",
      p: 4,
      opacity: 0.5,
    }}
  >
    <NumbersOutlinedIcon />
    <Typography variant="h6" sx={{ ml: 1 }}>
      {message}
    </Typography>
  </Box>
);

export default EmptySection;
