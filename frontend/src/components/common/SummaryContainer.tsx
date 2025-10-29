import {
  Box,
  Card,
  CardHeader,
  Grid,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

export const HeaderCard = styled(CardHeader)(({ theme }) => ({
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  fontFamily: "monospace",
  fontSize: "0.75rem",
}));

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
        <Stack spacing={1}>
          <Box display="flex">
            <Typography variant="body1">{title}</Typography>
          </Box>
          <Typography variant="h6" color={color}>
            {total}
          </Typography>
        </Stack>
      </Card>
    </Grid>
  );
};

export default SummaryContainer;
