import {
    Box,
    Card,
    CardContent,
    Typography,
  } from "@mui/material";
  
  interface StatCardProps {
    label: string;
    value: string | number;
    subtitle?: string;
  }
  
  export default function StatCard({
    label,
    value,
    subtitle,
  }: StatCardProps) {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontWeight: 500,
              mb: 1,
            }}
          >
            {label}
          </Typography>
  
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#000" }}
          >
            {value}
          </Typography>
  
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "#777",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }