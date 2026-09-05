import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Slider,
  InputAdornment,
  Box,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

export interface OutreachFilters {
  minRankingScore: number;
  outreachRate: number;
  modeOfOutreach: string[];
}

interface OutreachModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: OutreachFilters) => void;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<OutreachFilters>({
    minRankingScore: 70,
    outreachRate: 10,
    modeOfOutreach: ["email"],
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Configure Outreach
      </DialogTitle>

      <DialogContent>
        <Stack spacing={4} mt={2}>
          {/* Ranking Score */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Minimum Ranking Score
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Only candidates with a ranking score above this threshold
              will be considered for outreach.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Slider
                value={filters.minRankingScore}
                min={0}
                max={100}
                step={5}
                valueLabelDisplay="auto"
                onChange={(_, value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRankingScore: value as number,
                  }))
                }
              />

              <TextField
                size="small"
                value={filters.minRankingScore}
                onChange={(e) => {
                  const value = Math.min(
                    100,
                    Math.max(0, Number(e.target.value))
                  );

                  setFilters((prev) => ({
                    ...prev,
                    minRankingScore: value,
                  }));
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: 90 }}
              />
            </Stack>
          </Stack>

          {/* Outreach Rate */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Outreach Rate
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Maximum number of candidates to contact per day.
            </Typography>

            <TextField
              size="small"
              type="number"
              value={filters.outreachRate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  outreachRate: Math.max(
                    1,
                    Number(e.target.value)
                  ),
                }))
              }
              slotProps={{
                htmlInput: {
                  min: 1,
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      candidates/day
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
            />
          </Stack>

          {/* Mode of Outreach */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Mode of Outreach
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Select one or more channels to use for contacting
              candidates.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Outreach Channels</InputLabel>

              <Select
                multiple
                value={filters.modeOfOutreach}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    modeOfOutreach: e.target.value as string[],
                  }))
                }
                input={
                  <OutlinedInput label="Outreach Channels" />
                }
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={
                          value === "linkedin"
                            ? "LinkedIn"
                            : value.charAt(0).toUpperCase() +
                              value.slice(1)
                        }
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="call">
                  <Checkbox
                    checked={filters.modeOfOutreach.includes("call")}
                  />
                  <ListItemText primary="Call" />
                </MenuItem>

                <MenuItem value="email">
                  <Checkbox
                    checked={filters.modeOfOutreach.includes("email")}
                  />
                  <ListItemText primary="Email" />
                </MenuItem>

                <MenuItem value="linkedin">
                  <Checkbox
                    checked={filters.modeOfOutreach.includes("linkedin")}
                  />
                  <ListItemText primary="LinkedIn" />
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleApply}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Start Outreach
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OutreachModal;