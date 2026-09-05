import { useMemo, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Phone,
  PhoneCall,
  Search,
  TrendingUp,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type CallStatus =
  | "Completed"
  | "No Answer"
  | "Busy"
  | "Failed"
  | "In Progress";

type CallOutcome =
  | "Interested"
  | "Maybe"
  | "Not Interested"
  | "Undetermined";

interface CandidateCall {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: CallStatus;
  duration: string;
  outcome: CallOutcome;
  calledAt: string;
  summary: string;
  transcript: string;
}

const mockCalls: CandidateCall[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Senior Software Engineer",
    phone: "+91 98765 43210",
    status: "Completed",
    duration: "04:32",
    outcome: "Interested",
    calledAt: "2 min ago",
    summary:
      "John has 5 years of backend engineering experience and is interested in discussing the opportunity. He is available for an interview next week.",
    transcript:
      "AI: Hi John, I'm calling regarding the Senior Software Engineer opportunity.\n\nJohn: Sure, I have a few minutes.\n\nAI: Are you currently open to new opportunities?\n\nJohn: Yes, definitely. I'm actively looking.\n\nAI: Would you be interested in discussing this role further?\n\nJohn: Yes, I'd be interested.",
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "Backend Engineer",
    phone: "+91 99887 66554",
    status: "Completed",
    duration: "06:18",
    outcome: "Maybe",
    calledAt: "5 min ago",
    summary:
      "Sarah is open to the opportunity but would like to understand the compensation range and remote-work policy before proceeding.",
    transcript:
      "AI: Hi Sarah, I'm calling about an engineering opportunity.\n\nSarah: Okay, what company is this for?\n\nAI: The position is for a Backend Engineer.\n\nSarah: I'm potentially interested. What's the compensation range?",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Staff Engineer",
    phone: "+91 91234 56789",
    status: "No Answer",
    duration: "--",
    outcome: "Undetermined",
    calledAt: "8 min ago",
    summary: "",
    transcript: "",
  },
  {
    id: "4",
    name: "Alex Brown",
    role: "Software Engineer",
    phone: "+91 90011 22334",
    status: "Failed",
    duration: "--",
    outcome: "Undetermined",
    calledAt: "10 min ago",
    summary: "",
    transcript: "",
  },
  {
    id: "5",
    name: "Emily Davis",
    role: "Frontend Engineer",
    phone: "+91 88877 66554",
    status: "Completed",
    duration: "03:42",
    outcome: "Not Interested",
    calledAt: "14 min ago",
    summary:
      "Emily is not currently looking for a new opportunity and requested not to be contacted again.",
    transcript:
      "AI: Hi Emily, I'm calling regarding a Frontend Engineer opportunity.\n\nEmily: Thanks, but I'm not looking for a change right now.",
  },
  {
    id: "6",
    name: "David Wilson",
    role: "Platform Engineer",
    phone: "+91 87766 55443",
    status: "Completed",
    duration: "05:12",
    outcome: "Interested",
    calledAt: "18 min ago",
    summary:
      "David showed strong interest in the role and has relevant platform engineering experience.",
    transcript:
      "AI: Are you currently exploring new opportunities?\n\nDavid: Yes.\n\nAI: Would you be interested in a platform engineering role?\n\nDavid: Absolutely.",
  },
  {
    id: "7",
    name: "Rachel Thomas",
    role: "Engineering Manager",
    phone: "+91 76655 44332",
    status: "Busy",
    duration: "--",
    outcome: "Undetermined",
    calledAt: "22 min ago",
    summary: "",
    transcript: "",
  },
  {
    id: "8",
    name: "Daniel Martin",
    role: "Backend Engineer",
    phone: "+91 75544 33221",
    status: "Completed",
    duration: "04:08",
    outcome: "Interested",
    calledAt: "27 min ago",
    summary:
      "Daniel is interested and requested more information about the team and responsibilities.",
    transcript:
      "AI: Hi Daniel, I'm calling about a Backend Engineer role.\n\nDaniel: Yes, I'd like to hear more about it.\n\nAI: Would you be open to an interview?\n\nDaniel: Sure.",
  },
];

const activityData = [
  { time: "9 AM", initiated: 8, answered: 6, completed: 5 },
  { time: "10 AM", initiated: 14, answered: 10, completed: 8 },
  { time: "11 AM", initiated: 21, answered: 15, completed: 13 },
  { time: "12 PM", initiated: 17, answered: 12, completed: 10 },
  { time: "1 PM", initiated: 25, answered: 19, completed: 16 },
  { time: "2 PM", initiated: 19, answered: 14, completed: 12 },
  { time: "3 PM", initiated: 23, answered: 17, completed: 15 },
  { time: "4 PM", initiated: 16, answered: 12, completed: 10 },
];

const statusData = [
  { label: "Completed", value: 61 },
  { label: "No Answer", value: 14 },
  { label: "Busy", value: 8 },
  { label: "Failed", value: 10 },
  { label: "In Progress", value: 5 },
];

const outcomeData = [
  { label: "Interested", value: 24 },
  { label: "Maybe", value: 18 },
  { label: "Not Interested", value: 19 },
];

const statusColors: Record<
  CallStatus,
  "success" | "warning" | "error" | "info" | "default"
> = {
  Completed: "success",
  "No Answer": "warning",
  Busy: "warning",
  Failed: "error",
  "In Progress": "info",
};

const outcomeColors: Record<
  CallOutcome,
  "success" | "warning" | "error" | "default"
> = {
  Interested: "success",
  Maybe: "warning",
  "Not Interested": "error",
  Undetermined: "default",
};

function StatusBadge({ status }: { status: CallStatus }) {
  return (
    <Chip
      label={status}
      color={statusColors[status]}
      size="small"
      sx={{
        fontWeight: 500,
        borderRadius: "999px",
      }}
    />
  );
}

function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  return (
    <Chip
      label={outcome}
      color={outcomeColors[outcome]}
      size="small"
      sx={{
        fontWeight: 500,
        borderRadius: "999px",
      }}
    />
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 1,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            backgroundColor: "#f3f4f6",
            color: "#4b5563",
            display: "flex",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

export default function CallDashboard() {
  const [selectedCall, setSelectedCall] =
    useState<CandidateCall | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | CallStatus>("All");

  const [showFilters, setShowFilters] = useState(false);

  const filteredCalls = useMemo(() => {
    return mockCalls.filter((call) => {
      const matchesSearch =
        call.name.toLowerCase().includes(search.toLowerCase()) ||
        call.role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || call.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#fff",
        color: "#111827",
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            px: { xs: 2, md: 3 },
            py: 2.5,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={() => window.history.back()}
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                  },
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>

              <Box>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Forward Deployed Engineer
                  </Typography>

                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      backgroundColor: "#f3f4f6",
                      color: "#4b5563",
                      fontWeight: 500,
                    }}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 0.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Acme Corp
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    124 candidates
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<PhoneCall size={17} />}
              sx={{
                textTransform: "none",
                backgroundColor: "#111827",
                "&:hover": {
                  backgroundColor: "#1f2937",
                },
              }}
            >
              Start Calls
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Main */}
      <Box
        component="main"
        sx={{
          backgroundColor: "#fff",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            px: { xs: 2, md: 3 },
            py: 3.5,
          }}
        >
          {/* KPI Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 2,
            }}
          >
            <StatCard
              title="Candidates"
              value="124"
              subtitle="Total candidates"
              icon={<UserCheck size={19} />}
            />

            <StatCard
              title="Initiated"
              value="98"
              subtitle="79% of candidates"
              icon={<PhoneCall size={19} />}
            />

            <StatCard
              title="Answered"
              value="72"
              subtitle="73% answer rate"
              icon={<Phone size={19} />}
            />

            <StatCard
              title="Completed"
              value="61"
              subtitle="85% completion rate"
              icon={<CheckCircle2 size={19} />}
            />

            <StatCard
              title="Interested"
              value="24"
              subtitle="39% of completed"
              icon={<TrendingUp size={19} />}
            />

            <StatCard
              title="Avg. Duration"
              value="04:18"
              subtitle="Per completed call"
              icon={<Clock3 size={19} />}
            />
          </Box>

          {/* Analytics */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "2fr 1fr",
              },
              gap: 3,
              mt: 3,
            }}
          >
            {/* Call Activity */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                backgroundColor: "#fff",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                  >
                    Call activity
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Calls throughout the day
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ChevronDown size={15} />}
                  sx={{
                    textTransform: "none",
                    color: "#4b5563",
                    borderColor: "#e5e7eb",
                  }}
                >
                  Today
                </Button>
              </Stack>

              <Box sx={{ mt: 3, height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />

                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#9ca3af",
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#9ca3af",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        boxShadow:
                          "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="initiated"
                      stroke="#111827"
                      fill="#f3f4f6"
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="answered"
                      stroke="#6b7280"
                      fill="#f9fafb"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>

              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#111827",
                    }}
                  />

                  <Typography variant="caption" color="text.secondary">
                    Initiated
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#6b7280",
                    }}
                  />

                  <Typography variant="caption" color="text.secondary">
                    Answered
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            {/* Status */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600 }}
              >
                Call status
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Current campaign status
              </Typography>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {statusData.map((item) => {
                  const percentage = Math.round(
                    (item.value / 98) * 100
                  );

                  return (
                    <Box key={item.label}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {item.label}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500 }}
                        >
                          {item.value}
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 7,
                          borderRadius: 10,
                          backgroundColor: "#f3f4f6",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 10,
                            backgroundColor: "#1f2937",
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Answer rate
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600 }}
                >
                  73%
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <TrendingUp
                  size={13}
                  color="#059669"
                />

                <Typography
                  variant="caption"
                  sx={{ color: "#059669" }}
                >
                  8.2% vs previous campaign
                </Typography>
              </Stack>
            </Paper>
          </Box>

          {/* Candidate Outcome */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2.5,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  Candidate outcome
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Interest generated from completed calls
                </Typography>
              </Box>

              <BarChart3 size={20} color="#9ca3af" />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
                mt: 2.5,
              }}
            >
              {outcomeData.map((item) => {
                const percentage = Math.round(
                  (item.value / 61) * 100
                );

                return (
                  <Box
                    key={item.label}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #f3f4f6",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                      >
                        {item.value}
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        mt: 1.5,
                        height: 6,
                        borderRadius: 10,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          backgroundColor: "#374151",
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {percentage}% of completed calls
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Calls Table */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Box sx={{ p: 2.5 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                  >
                    Candidate calls
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Review calls and candidate responses
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Search candidate..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      width: 230,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search
                            size={16}
                            color="#9ca3af"
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowFilters(!showFilters)}
                    endIcon={<ChevronDown size={15} />}
                    sx={{
                      textTransform: "none",
                      color: "#4b5563",
                      borderColor: "#e5e7eb",
                    }}
                  >
                    Filter
                  </Button>
                </Stack>
              </Stack>

              {showFilters && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 2 }}
                >
                  {[
                    "All",
                    "Completed",
                    "No Answer",
                    "Busy",
                    "Failed",
                    "In Progress",
                  ].map((status) => (
                    <Chip
                      key={status}
                      label={status}
                      clickable
                      onClick={() =>
                        setStatusFilter(
                          status as "All" | CallStatus
                        )
                      }
                      color={
                        statusFilter === status
                          ? "primary"
                          : "default"
                      }
                      variant={
                        statusFilter === status
                          ? "filled"
                          : "outlined"
                      }
                      sx={{
                        borderRadius: "999px",
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Divider />

            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  minWidth: 800,
                  borderCollapse: "collapse",
                  "& th": {
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    textAlign: "left",
                    padding: "12px 20px",
                    borderBottom: "1px solid #f3f4f6",
                  },
                  "& td": {
                    padding: "16px 20px",
                    borderBottom: "1px solid #f3f4f6",
                  },
                  "& tbody tr": {
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                  },
                  "& tbody tr:hover": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Outcome</th>
                    <th>Called</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCalls.map((call) => (
                    <tr
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                    >
                      <td>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: "#f3f4f6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#374151",
                            }}
                          >
                            {call.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Box>

                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: "#111827",
                              }}
                            >
                              {call.name}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {call.role}
                            </Typography>
                          </Box>
                        </Stack>
                      </td>

                      <td>
                        <StatusBadge status={call.status} />
                      </td>

                      <td>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {call.duration}
                        </Typography>
                      </td>

                      <td>
                        <OutcomeBadge outcome={call.outcome} />
                      </td>

                      <td>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {call.calledAt}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Box>

              {filteredCalls.length === 0 && (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No candidates found.
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2.5, py: 1.5 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Showing {filteredCalls.length} of 124 candidates
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                  }}
                >
                  Previous
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                  }}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Candidate Details Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedCall)}
        onClose={() => setSelectedCall(null)}
        PaperProps={{
          sx: {
            width: {
              xs: "100%",
              sm: 520,
            },
            backgroundColor: "#fff",
          },
        }}
      >
        {selectedCall && (
          <>
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid #e5e7eb",
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Stack direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    {selectedCall.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                    >
                      {selectedCall.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {selectedCall.role}
                    </Typography>
                  </Box>
                </Stack>

                <IconButton
                  onClick={() => setSelectedCall(null)}
                  sx={{ color: "#9ca3af" }}
                >
                  <X size={20} />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>

                {/* Call Info */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Status
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <StatusBadge
                        status={selectedCall.status}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Duration
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontWeight: 500,
                      }}
                    >
                      {selectedCall.duration}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Outcome
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <OutcomeBadge
                        outcome={selectedCall.outcome}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Candidate */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600 }}
                  >
                    Candidate
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.5,
                      p: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Phone size={15} color="#6b7280" />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {selectedCall.phone}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1 }}
                    >
                      <Calendar size={15} color="#6b7280" />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {selectedCall.calledAt}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                {/* Summary */}
                {selectedCall.summary && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600 }}
                    >
                      Call summary
                    </Typography>

                    <Box
                      sx={{
                        mt: 1.5,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {selectedCall.summary}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Transcript */}
                {selectedCall.transcript && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600 }}
                    >
                      Transcript
                    </Typography>

                    <Box
                      sx={{
                        mt: 1.5,
                        p: 2,
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.8,
                        }}
                      >
                        {selectedCall.transcript}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Empty state */}
                {!selectedCall.summary &&
                  !selectedCall.transcript && (
                    <Box
                      sx={{
                        py: 5,
                        textAlign: "center",
                        border: "1px dashed #e5e7eb",
                        borderRadius: 2,
                      }}
                    >
                      {selectedCall.status === "Failed" ? (
                        <XCircle
                          size={28}
                          color="#f87171"
                        />
                      ) : (
                        <Clock3
                          size={28}
                          color="#9ca3af"
                        />
                      )}

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        No call details available
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        Details will appear once the webhook is
                        processed.
                      </Typography>
                    </Box>
                  )}
              </Stack>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
}