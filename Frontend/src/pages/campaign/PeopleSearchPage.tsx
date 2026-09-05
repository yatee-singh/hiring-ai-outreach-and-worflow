  import { useEffect, useMemo, useState } from "react";
import {OutreachModal} from "../../components/OutreachModal"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  FilterList,
  PersonSearch,
  Search,
  Star,
} from "@mui/icons-material";
import { useCampaign } from "../../hook/useCampaign";
import { OutreachFilters } from "../../components/OutreachModal";
import { useNavigate } from "react-router-dom";

// Replace this with your actual API client
const API_BASE_URL = "http://localhost:8000";

  

interface Candidate {
  id: string;
  pdl_id: string;
  name: string | null;
  job_title: string | null;
  company: string | null;
  location: string | null;
  linkedin_url: string | null;
  phone?: string | null;
}

interface PeopleSearchResponse {
  count: number;
  candidates: Candidate[];
}

interface PeopleSearchPageProps {
  jobCampaignId: string;
}

interface OutreachResponse {
    message: string;
  }

export default function PeopleSearchPage({
}: PeopleSearchPageProps): JSX.Element {

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()
  const [filter, setFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const campaign=useCampaign().campaign
  const [outreachOpen, setOutreachOpen] = useState(false);

  const startOutreach = async (
    campaignId: string | undefined
  ): Promise<OutreachResponse> => {
    const response = await fetch(
      `http://localhost:8000/organizations/${campaignId}/outreach`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to start outreach");
    }
  
    return response.json();
  };

  const handleStartOutreach = async (filters: OutreachFilters) => {
    try {
      setLoading(true);
  
      console.log("Outreach filters:", filters);
  
      const response = await startOutreach(campaign?.id);
  
      console.log(response.message);
    } catch (error) {
      console.error("Failed to start outreach:", error);
    } finally {
      setLoading(false);
      navigate(`/job-campaigns/${campaign?.id}/call-dashboard`);
    }
  };
  
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/people/${campaign?.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const data: PeopleSearchResponse = await response.json();

      setCandidates(data.candidates ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [campaign]);

  /**
   * Trigger the actual candidate search.
   *
   * POST /people/search/{job_campaign_id}
   */
  const handleSearch = async () => {
    try {
      setSearching(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/people/search/${campaign?.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Candidate search failed");
      }

      const data: PeopleSearchResponse = await response.json();

      setCandidates(data.candidates ?? []);
      setPage(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to search for candidates"
      );
    } finally {
      setSearching(false);
    }
  };
  const handleOutreach = (filters: OutreachFilters) => {
    console.log("Outreach filters:", filters);
  
    // Call your backend here
  };
  /**
   * Rank candidates.
   *
   * Replace this URL with your ranking endpoint.
   */

  const handleRankCandidates = async () => {
    try {
      setRanking(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/people/rank/${jobCampaignId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Candidate ranking failed");
      }

      // If your API returns ranked candidates:
      const data: PeopleSearchResponse = await response.json();

      setCandidates(data.candidates ?? candidates);
      setPage(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to rank candidates"
      );
    } finally {
      setRanking(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    const search = filter.trim().toLowerCase();
    const location = locationFilter.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !search ||
        candidate.name?.toLowerCase().includes(search) ||
        candidate.job_title?.toLowerCase().includes(search) ||
        candidate.company?.toLowerCase().includes(search);

      const matchesLocation =
        !location ||
        candidate.location?.toLowerCase().includes(location);

      return matchesSearch && matchesLocation;
    });
  }, [candidates, filter, locationFilter]);

  const paginatedCandidates = filteredCandidates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(0);
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    setPage(0);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:"white"
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">
            Loading candidates...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: 4,
        background:'white'
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
       
        mb={4}
        sx={{
            width: "100%",
            
          }}
        >
        <Box>
            <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "black" }}
            >
            People Search
            </Typography>

            <Typography
            variant="body2"
            sx={{ color: "black",marginBottom:'10px' }}
        
            >
            Find and manage candidates for this job campaign.
            </Typography>
        </Box>

        {candidates.length > 0 && (
           <Stack
           direction="row"
           spacing={1}
        //    justifyContent="flex-end"
        //    alignItems="center"
         >
           <Button
             variant="contained"
             size="small"
             startIcon={
               ranking ? (
                 <CircularProgress size={16} color="inherit" />
               ) : (
                 <Star sx={{ fontSize: 18 }} />
               )
             }
             onClick={handleRankCandidates}
             disabled={ranking}
             sx={{
               height: 36,
               px: 1.75,
               borderRadius: 1.5,
               textTransform: "none",
               fontWeight: 600,
               fontSize: "0.85rem",
               boxShadow: "none",
               "&:hover": {
                 boxShadow: "none",
               },
             }}
           >
             {ranking ? "Ranking..." : "Rank Candidates"}
           </Button>
         
           <Button

            onClick={() => setOutreachOpen(true)}
            
             variant="contained"
             size="small"
             startIcon={<Star sx={{ fontSize: 18 }} />}
            
             disabled={ranking}
             sx={{
               height: 36,
               px: 1.75,
               borderRadius: 1.5,
               textTransform: "none",
               fontWeight: 600,
               fontSize: "0.85rem",
               boxShadow: "none",
               "&:hover": {
                 boxShadow: "none",
               },
             }}
           >
             Trigger Phone Calls to Candidates
           </Button>
         </Stack>
        )}
        </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {candidates.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              minHeight: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              spacing={2}
              alignItems="center"
              textAlign="center"
              maxWidth={500}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "primary.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonSearch
                  sx={{
                    fontSize: 36,
                    color: "primary.main",
                  }}
                />
              </Box>

              <Typography variant="h6" fontWeight={600}>
                Trigger Search for Candidates based on the JD
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 420 }}
              >
                Search for candidates matching the requirements
                of this job campaign. Candidates will appear here
                once the search is complete.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={
                  searching ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <PersonSearch />
                  )
                }
                onClick={handleSearch}
                disabled={searching}
                sx={{
                  mt: 1,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {searching ? "Searching..." : "Trigger Search"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters */}
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              mb: 3,
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", md: "center" }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mr: 1 }}
                >
                  <FilterList color="action" />

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Filters
                  </Typography>
                </Stack>

                <TextField
                  size="small"
                  placeholder="Search candidates..."
                  value={filter}
                  onChange={(e) =>
                    handleFilterChange(e.target.value)
                  }
                  sx={{ minWidth: { md: 300 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  select
                  size="small"
                  label="Location"
                  value={locationFilter}
                  onChange={(e) =>
                    handleLocationChange(e.target.value)
                  }
                  sx={{ minWidth: { md: 180 } }}
                >
                  <MenuItem value="">All locations</MenuItem>

                  {Array.from(
                    new Set(
                      candidates
                        .map((candidate) => candidate.location)
                        .filter(Boolean)
                    )
                  ).map((location) => (
                    <MenuItem
                      key={location}
                      value={location as string}
                    >
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </CardContent>
          </Card>

          {/* Candidate Table */}
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    Candidates
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {filteredCandidates.length} candidate
                    {filteredCandidates.length !== 1
                      ? "s"
                      : ""}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Candidate
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      Current Role
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      Company
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      Location
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      LinkedIn
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedCandidates.map((candidate) => (
                    <TableRow
                      key={candidate.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {candidate.name || "Unknown"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {candidate.job_title || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {candidate.company || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {candidate.location || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {candidate.linkedin_url ? (
                          <Button
                            size="small"
                            variant="text"
                            href={
                              candidate.linkedin_url.startsWith(
                                "http"
                              )
                                ? candidate.linkedin_url
                                : `https://${candidate.linkedin_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textTransform: "none" }}
                          >
                            View Profile
                          </Button>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {paginatedCandidates.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ py: 8 }}
                      >
                        <Typography
                          color="text.secondary"
                        >
                          No candidates match your filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredCandidates.length}
              page={page}
              onPageChange={(_, newPage) =>
                setPage(newPage)
              }
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(
                  parseInt(event.target.value, 10)
                );
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </Card>

        </>
      )}
        <OutreachModal
    open={outreachOpen}
    onClose={() => setOutreachOpen(false)}
    onApply={handleStartOutreach}
/>
    </Box>
  );
}