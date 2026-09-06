import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
  } from "@mui/material";
  import ClearIcon from "@mui/icons-material/Clear";
  
  interface Props {
    search: string;
    status: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onClear: () => void;
  }
  
  export default function ApplicantFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
    onClear,
  }: Props) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email or phone..."
          size="small"
          sx={{
            minWidth: 320,
            flex: 1,
            "& .MuiInputBase-input": {
              color: "#000",
            },
            "& .MuiInputLabel-root": {
              color: "#000",
            },
          }}
        />
  
        <FormControl
          size="small"
          sx={{
            minWidth: 180,
            "& .MuiInputLabel-root": {
              color: "#000",
            },
            "& .MuiSelect-select": {
              color: "#000",
            },
          }}
        >
          <InputLabel>Status</InputLabel>
  
          <Select
            value={status}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {/* "active",
            "rejected",
            "hired" */}
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="active">active</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="hired">Hired</MenuItem>
          </Select>
        </FormControl>
  
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClear}
          sx={{
            color: "#000",
            borderColor: "#d1d5db",
            textTransform: "none",
            height: 40,
          }}
        >
          Clear filters
        </Button>
      </Box>
    );
  }