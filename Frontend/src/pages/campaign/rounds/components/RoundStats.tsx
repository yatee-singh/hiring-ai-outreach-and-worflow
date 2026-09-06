import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

interface Props {
  totalApplicants: number;
  totalCalled: number;
  totalCompleted: number;
  totalPassed: number;
}

interface StatProps {
  label: string;
  value: number;
  description: string;
}

const Stat = ({ label, value, description }: StatProps) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      border: "1px solid #e5e5e5",
      borderRadius: 3,
      backgroundColor: "#fff",
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
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
          lineHeight: 1,
          mb: 1,
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "#555",
        }}
      >
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const RoundStats = ({
  totalApplicants,
  totalCalled,
  totalCompleted,
  totalPassed,
}: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Stat
          label="Applicants"
          value={totalApplicants}
          description="Total applicants in campaign"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Stat
          label="Called"
          value={totalCalled}
          description="Applicants with a Hunar call"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Stat
          label="Completed"
          value={totalCompleted}
          description="Completed rounds"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Stat
          label="Passed"
          value={totalPassed}
          description="Applicants meeting passing score"
        />
      </Grid>
    </Grid>
  );
};

export default RoundStats;

