import { Chip } from "@mui/material";

interface CallStatusChipProps {
  status?: string | null;
}

export default function CallStatusChip({
  status,
}: CallStatusChipProps) {
  if (!status) {
    return (
      <Chip
        label="Not called"
        size="small"
        variant="outlined"
        sx={{
          color: "#666",
          borderColor: "#ccc",
          backgroundColor: "#fff",
        }}
      />
    );
  }

  const formatted = status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Chip
      label={formatted}
      size="small"
      variant="outlined"
      sx={{
        color: "#000",
        borderColor: "#000",
        backgroundColor: "#fff",
        fontWeight: 500,
      }}
    />
  );
}