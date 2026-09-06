import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import ApplicantFilters from "./components/ApplicantFilters";
import ApplicantStats from "./components/ApplicantStats";
import ApplicantTable from "./components/ApplicantTable";
import { useApplicants } from "./hooks/useApplicant";
import {useCampaign} from "../../hook/useCampaign"


export default function Applicants() {
  const jobId=useCampaign().campaign?.id
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const {
    applicants,
    loading,
    error,
  } = useApplicants(jobId, status);

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return applicants;
    }

    return applicants.filter((applicant) => {
      return (
        applicant.name.toLowerCase().includes(query) ||
        applicant.email?.toLowerCase().includes(query) ||
        applicant.phone.toLowerCase().includes(query)
      );
    });
  }, [applicants, search]);

  const stats = useMemo(() => {
    return {
      total: applicants.length,

      shortlisted: applicants.filter(
        (a) => a.status.toLowerCase() === "shortlisted"
      ).length,

      pending: applicants.filter(
        (a) => a.status.toLowerCase() === "pending"
      ).length,

      rejected: applicants.filter(
        (a) => a.status.toLowerCase() === "rejected"
      ).length,
    };
  }, [applicants]);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#000",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#000",
              fontWeight: 700,
              mb: 0.75,
            }}
          >
            Applicants
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#555",
            }}
          >
            Manage and review candidates who applied to this job.
          </Typography>
        </Box>

        {/* Stats */}
        <ApplicantStats
          total={stats.total}
          shortlisted={stats.shortlisted}
          pending={stats.pending}
          rejected={stats.rejected}
        />

        {/* Filters */}
        <ApplicantFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              color: "#000",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
            }}
          >
            <CircularProgress sx={{ color: "#000" }} />
          </Box>
        ) : (
          <ApplicantTable applicants={filteredApplicants} />
        )}
      </Container>
    </Box>
  );
}