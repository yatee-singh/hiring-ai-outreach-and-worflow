import { Grid } from "@mui/material";
import StatCard from "./StatCard";
import type { DashboardKPIs } from "../types";

interface StatsGridProps {
  kpis: DashboardKPIs;
}

export default function StatsGrid({ kpis }: StatsGridProps) {
  const stats = [
    {
      label: "Total Candidates",
      value: kpis.total_candidates,
    },
    {
      label: "Called",
      value: kpis.called,
    },
    {
      label: "Currently Calling",
      value: kpis.calling,
    },
    {
      label: "Connected",
      value: kpis.connected,
    },
    {
      label: "Interested",
      value: kpis.interested,
    },
    {
      label: "Not Interested",
      value: kpis.not_interested,
    },
    {
      label: "No Answer",
      value: kpis.no_answer,
    },
    {
      label: "Failed",
      value: kpis.failed,
    },
    {
      label: "Contact Rate",
      value: `${kpis.contact_rate}%`,
    },
    {
      label: "Interest Rate",
      value: `${kpis.interest_rate}%`,
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {stats.map((stat) => (
        <Grid
          key={stat.label}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            label={stat.label}
            value={stat.value}
          />
        </Grid>
      ))}
    </Grid>
  );
}