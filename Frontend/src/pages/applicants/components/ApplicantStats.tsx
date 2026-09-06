import {
    Card,
    CardContent,
    Grid,
    Typography,
  } from "@mui/material";
  import PeopleIcon from "@mui/icons-material/People";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import ScheduleIcon from "@mui/icons-material/Schedule";
  import CancelIcon from "@mui/icons-material/Cancel";
  
  interface Props {
    total: number;
    shortlisted: number;
    pending: number;
    rejected: number;
  }
  
  interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
  }
  
  function StatCard({ label, value, icon }: StatCardProps) {
    return (
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          height: "100%",
        }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography
                variant="body2"
                sx={{
                  color: "#000",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {label}
              </Typography>
  
              <Typography
                variant="h4"
                sx={{
                  color: "#000",
                  fontWeight: 700,
                }}
              >
                {value}
              </Typography>
            </div>
  
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
              }}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  export default function ApplicantStats({
    total,
    shortlisted,
    pending,
    rejected,
  }: Props) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Total Applicants"
            value={total}
            icon={<PeopleIcon />}
          />
        </Grid>
  
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Shortlisted"
            value={shortlisted}
            icon={<CheckCircleIcon />}
          />
        </Grid>
  
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Pending"
            value={pending}
            icon={<ScheduleIcon />}
          />
        </Grid>
  
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Rejected"
            value={rejected}
            icon={<CancelIcon />}
          />
        </Grid>
      </Grid>
    );
  }