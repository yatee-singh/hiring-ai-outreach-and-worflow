import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { campaignStore } from "../lib/campaign";
import { auth } from "../lib/auth";
import { JobCampaign } from "../types/campaign";
import { API_URL } from "../config/api";




export default function DashboardPage() {
  const navigate = useNavigate();

  const user = auth.getUser();

  const [campaigns, setCampaigns] = useState<JobCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [creating, setCreating] = useState(false);

  const organizationId = user?.organization?.id;

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          `${API_URL}/organizations/${organizationId}/job-campaigns`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to load campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [organizationId]);

  const createCampaign = async () => {
    const name = campaignName.trim();

    if (!name || !organizationId) {
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(
        `${API_URL}/organizations/${organizationId}/job-campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      const newCampaign: JobCampaign = await response.json();

      setCampaigns((current) => [newCampaign, ...current]);

      setCampaignName("");
      setShowCreateModal(false);

     // navigate(`/job-campaigns/${newCampaign.id}/job-description`);
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        py: 6,
      }}
    >
      <Container maxWidth="lg">

        {/* Header */}
        <Box
          sx={{
            mb: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Welcome, {user.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 1,
                color: "#6b7280",
              }}
            >
              {user.organization?.name}
            </Typography>
          </Box>
        </Box>

        {/* Campaign Header */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Job Campaigns
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "#6b7280",
              }}
            >
              Manage your recruitment campaigns
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateModal(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1.2,
              boxShadow: "none",
              backgroundColor: "#111827",
              "&:hover": {
                backgroundColor: "#1f2937",
                boxShadow: "none",
              },
            }}
          >
            New Campaign
          </Button>
        </Box>

        {/* Campaigns */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : campaigns.length === 0 ? (
          <Box
            sx={{
              border: "1px dashed #d1d5db",
              borderRadius: 3,
              backgroundColor: "#ffffff",
              py: 10,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#374151",
              }}
            >
              No job campaigns yet
            </Typography>

            
          </Box>
        ) : (
          <Grid container spacing={3}>
            {campaigns.map((campaign) => (
              <Grid
                key={campaign.id}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: "#eef2ff",
                    border: "1px solid #e0e7ff",
                    boxShadow: "none",
                    transition: "all 0.2s ease",

                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 10px 30px rgba(0, 0, 0, 0.08)",
                      borderColor: "#c7d2fe",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                        campaignStore.setCampaign(
                          campaign
                        );
                    
                        navigate(
                          `/job-campaigns/${campaign.id}`
                        );
                      }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Card Header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#111827",
                          }}
                        >
                          {campaign.name}
                        </Typography>

                        <Chip
                          label={campaign.status}
                          size="small"
                          sx={{
                            backgroundColor: "#ffffff",
                            fontWeight: 500,
                          }}
                        />
                      </Box>

                      {/* Card Footer */}
                      <Box
                        sx={{
                          mt: "auto",
                          pt: 5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                          }}
                        >
                          Created{" "}
                          {new Date(
                            campaign.created_at
                          ).toLocaleDateString()}
                        </Typography>

                        <ArrowForwardIcon
                          sx={{
                            fontSize: 20,
                            color: "#6b7280",
                          }}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Create Campaign Dialog */}
      <Dialog
        open={showCreateModal}
        onClose={() => {
          if (!creating) {
            setShowCreateModal(false);
            setCampaignName("");
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            pb: 1,
          }}
        >
          Create Job Campaign
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: "#6b7280",
            }}
          >
            Give your campaign a name to get started.
          </Typography>

          <TextField
            fullWidth
            autoFocus
            label="Campaign name"
            placeholder="e.g. Senior Backend Hiring"
            value={campaignName}
            onChange={(e) =>
              setCampaignName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !creating) {
                createCampaign();
              }
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() => {
              setShowCreateModal(false);
              setCampaignName("");
            }}
            disabled={creating}
            sx={{
              textTransform: "none",
              color: "#6b7280",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={createCampaign}
            disabled={!campaignName.trim() || creating}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              backgroundColor: "#111827",
              "&:hover": {
                backgroundColor: "#1f2937",
              },
            }}
          >
            {creating ? (
              <CircularProgress
                size={20}
                sx={{ color: "white" }}
              />
            ) : (
              "Create Campaign"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

