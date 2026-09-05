import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

import {
  Add,
  Delete,
  Work,
  LocationOnOutlined,
  BusinessCenterOutlined,
  AttachMoneyOutlined,
  PsychologyOutlined,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import { useCampaign } from "../../hook/useCampaign";
import { useNavigate } from "react-router-dom";
import { JobDescriptionForm } from "../../types/jobDescription";
const JobDescriptionPage = () => {

  const [form, setForm] = useState({
    job_title: "",
    description: "",
    location: "",
    employment_type: "Full Time",
    experience_min: "",
    experience_max: "",
    salary_min: "",
    salary_max: "",
    skills: [] as string[],
    requirements: [""],
  });
  const campaign=useCampaign().campaign
  const navigate=useNavigate()

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);


    

    const [jobDescription, setJobDescription] =
    useState<JobDescriptionForm | null>(null);

    useEffect(() => {
    
    if (!campaign) return;

    const fetchJobDescription = async () => {
        try {
        const response = await fetch(
            `http://localhost:8000/job-descriptions/campaign/${campaign.id}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch job description");
        }

        const data: JobDescriptionForm = await response.json();

        setJobDescription(data);
        } catch (error) {
        console.error("Error fetching job description:", error);
        }
    };

    fetchJobDescription();
    }, []);



  // -----------------------------
  // Form helpers
  // -----------------------------

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      form.skills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const addRequirement = () => {
    setForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const updateRequirement = (
    index: number,
    value: string
  ) => {
    const updated = [...form.requirements];

    updated[index] = value;

    setForm((prev) => ({
      ...prev,
      requirements: updated,
    }));
  };

  const removeRequirement = (index: number) => {
    if (form.requirements.length === 1) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // -----------------------------
  // Validation
  // -----------------------------

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.job_title.trim()) {
      newErrors.job_title = "Job title is required";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Please provide a job description";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (
      form.experience_min &&
      form.experience_max &&
      Number(form.experience_min) >
        Number(form.experience_max)
    ) {
      newErrors.experience_max =
        "Maximum experience must be greater than minimum";
    }

    if (
      form.salary_min &&
      form.salary_max &&
      Number(form.salary_min) >
        Number(form.salary_max)
    ) {
      newErrors.salary_max =
        "Maximum salary must be greater than minimum";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
  
    if (!campaign?.id) {
      alert("Campaign ID is missing");
      return;
    }
  
    setSaving(true);
  
    try {
      const response = await fetch(
        "http://localhost:8000/job-descriptions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_campaign_id: campaign?.id,
  
            job_title: form.job_title,
            description: form.description || null,
            location: form.location || null,
            employment_type:
              form.employment_type || null,
  
            experience_min: form.experience_min
              ? Number(form.experience_min)
              : null,
  
            experience_max: form.experience_max
              ? Number(form.experience_max)
              : null,
  
            salary_min: form.salary_min
              ? Number(form.salary_min)
              : null,
  
            salary_max: form.salary_max
              ? Number(form.salary_max)
              : null,
  
            skills: form.skills,
  
            requirements: form.requirements.filter(
              (requirement) =>
                requirement.trim() !== ""
            ),
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to create job description"
        );
      }
  
      console.log(
        "Job description created:",
        data
      );

      setJobDescription(data)
      navigate(`/job-campaigns/${campaign.id}/people-search`)
  
      
     
  
    } catch (error) {
      console.error(error);
  
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "#f7f8fa",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <Work />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "text.primary" }}
              >
                Job Description
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.primary" }}
              >
                Tell us about the role you're hiring for
              </Typography>
            </Box>
          </Stack>
        </Box>
        {jobDescription ? (
        // ==============================
        // EXISTING JOB DESCRIPTION
        // ==============================
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: "text.primary", mb: 1 }}
            >
              {jobDescription.job_title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {jobDescription.location} ·{" "}
              {jobDescription.employment_type}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ color: "text.primary", mb: 1 }}
            >
              Description
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                whiteSpace: "pre-wrap",
                mb: 3,
              }}
            >
              {jobDescription.description}
            </Typography>

            {jobDescription.skills?.length > 0 && (
              <>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ color: "text.primary", mb: 1 }}
                >
                  Skills
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mb: 3 }}
                >
                  {jobDescription.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </>
            )}

            {jobDescription.requirements?.length > 0 && (
              <>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ color: "text.primary", mb: 1 }}
                >
                  Requirements
                </Typography>

                <Stack spacing={1}>
                  {jobDescription.requirements.map(
                    (requirement, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        sx={{ color: "text.primary" }}
                      >
                        • {requirement}
                      </Typography>
                    )
                  )}
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      ) :(<>
        <Grid container spacing={3}>
          {/* ================================= */}
          {/* LEFT SIDE - FORM */}
          {/* ================================= */}

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* -------------------------------- */}
              {/* Basic Information */}
              {/* -------------------------------- */}

              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    icon={<BusinessCenterOutlined />}
                    title="Basic Information"
                    description="The essential details about this position"
                  />

                  <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                      fullWidth
                      required
                      label="Job Title"
                      placeholder="e.g. Senior Backend Engineer"
                      value={form.job_title}
                      onChange={(e) =>
                        updateField(
                          "job_title",
                          e.target.value
                        )
                      }
                      error={!!errors.job_title}
                      helperText={errors.job_title}
                    />

                    <TextField
                      fullWidth
                      required
                      multiline
                      label="Job Description"
                      placeholder="Describe the role, responsibilities, team and what the candidate will be working on..."
                      value={form.description}
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                      error={!!errors.description}
                      helperText={
                        errors.description ||
                        `${form.description.length} characters`
                      }
                    />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          required
                          label="Location"
                          placeholder="e.g. Bangalore"
                          value={form.location}
                          onChange={(e) =>
                            updateField(
                              "location",
                              e.target.value
                            )
                          }
                          error={!!errors.location}
                          helperText={errors.location}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOnOutlined fontSize="small" />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel>
                            Employment Type
                          </InputLabel>

                          <Select
                            label="Employment Type"
                            value={form.employment_type}
                            onChange={(e) =>
                              updateField(
                                "employment_type",
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="Full Time">
                              Full Time
                            </MenuItem>

                            <MenuItem value="Part Time">
                              Part Time
                            </MenuItem>

                            <MenuItem value="Contract">
                              Contract
                            </MenuItem>

                            <MenuItem value="Internship">
                              Internship
                            </MenuItem>

                            <MenuItem value="Freelance">
                              Freelance
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>

              {/* -------------------------------- */}
              {/* Experience */}
              {/* -------------------------------- */}

              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    icon={<Work />}
                    title="Experience"
                    description="What level of experience are you looking for?"
                  />

                  <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                  >
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Minimum Experience"
                        placeholder="e.g. 3"
                        value={form.experience_min}
                        onChange={(e) =>
                          updateField(
                            "experience_min",
                            e.target.value
                          )
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                years
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Maximum Experience"
                        placeholder="e.g. 6"
                        value={form.experience_max}
                        onChange={(e) =>
                          updateField(
                            "experience_max",
                            e.target.value
                          )
                        }
                        error={!!errors.experience_max}
                        helperText={
                          errors.experience_max
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                years
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* -------------------------------- */}
              {/* Salary */}
              {/* -------------------------------- */}

              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    icon={<AttachMoneyOutlined />}
                    title="Salary Range"
                    description="Optional compensation range for this position"
                  />

                  <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                  >
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Minimum Salary"
                        placeholder="e.g. 1200000"
                        value={form.salary_min}
                        onChange={(e) =>
                          updateField(
                            "salary_min",
                            e.target.value
                          )
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Maximum Salary"
                        placeholder="e.g. 2500000"
                        value={form.salary_max}
                        onChange={(e) =>
                          updateField(
                            "salary_max",
                            e.target.value
                          )
                        }
                        error={!!errors.salary_max}
                        helperText={errors.salary_max}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Enter annual compensation in INR.
                  </Typography>
                </CardContent>
              </Card>

              {/* -------------------------------- */}
              {/* Skills */}
              {/* -------------------------------- */}

              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    icon={<PsychologyOutlined />}
                    title="Required Skills"
                    description="Add the key skills you're looking for"
                  />

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 3 }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Python"
                      value={skillInput}
                      onChange={(e) =>
                        setSkillInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addSkill}
                      sx={{
                        minWidth: 100,
                        textTransform: "none",
                      }}
                    >
                      Add
                    </Button>
                  </Stack>

                  {form.skills.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ mt: 2 }}
                    >
                      {form.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onDelete={() =>
                            removeSkill(skill)
                          }
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  )}

                  {form.skills.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      No skills added yet. Add skills
                      like Python, React, PostgreSQL, etc.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* -------------------------------- */}
              {/* Requirements */}
              {/* -------------------------------- */}

              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    icon={<CheckCircle />}
                    title="Requirements"
                    description="Define what candidates need to succeed in this role"
                  />

                  <Stack spacing={2} sx={{ mt: 3 }}>
                    {form.requirements.map(
                      (requirement, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              bgcolor: "action.hover",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              variant="caption"
                              fontWeight={600}
                            >
                              {index + 1}
                            </Typography>
                          </Box>

                          <TextField
                            fullWidth
                            size="small"
                            placeholder="e.g. 3+ years of Python experience"
                            value={requirement}
                            onChange={(e) =>
                              updateRequirement(
                                index,
                                e.target.value
                              )
                            }
                          />

                          <IconButton
                            color="error"
                            onClick={() =>
                              removeRequirement(index)
                            }
                            disabled={
                              form.requirements
                                .length === 1
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      )
                    )}

                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addRequirement}
                      sx={{
                        alignSelf: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      Add Requirement
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* ================================= */}
          {/* RIGHT SIDE - PREVIEW */}
          {/* ================================= */}

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: 24,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                  >
                    Job Preview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    See how your job will look to
                    candidates.
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {form.job_title ||
                      "Your Job Title"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1 }}
                  >
                    <LocationOnOutlined
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {form.location ||
                        "Location not specified"}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1 }}
                  >
                    <Work
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {form.employment_type}
                    </Typography>
                  </Stack>

                  {(form.experience_min ||
                    form.experience_max) && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {form.experience_min || "0"} -{" "}
                      {form.experience_max || "∞"} years
                      experience
                    </Typography>
                  )}

                  <Divider sx={{ my: 3 }} />

                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Description
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "pre-wrap",
                      display: "-webkit-box",
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {form.description ||
                      "Your job description will appear here..."}
                  </Typography>

                  {form.skills.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mt: 3, mb: 1 }}
                      >
                        Skills
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {form.skills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                          />
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Tip */}
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  Hiring tip
                </Typography>

                <Typography variant="caption">
                  Specific requirements help our AI find
                  better matching candidates.
                </Typography>
              </Alert>
            </Box>
          </Grid>
        </Grid>
        <Paper
        elevation={3}
        sx={{
          position: "sticky",
          bottom: 16,
          mt: 4,
          p: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              px: 3,
            }}
          >
            Save Draft
          </Button>

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={handleSubmit}
            loading={saving}
            sx={{
              textTransform: "none",
              px: 3,
            }}
          >
            Save & Continue
          </Button>
        </Stack>
      </Paper></>)}

        {/* ================================= */}
        {/* ACTION BAR */}
        {/* ================================= */}

        
      </Box>
    </Box>
  );
};

// -------------------------------------
// Reusable Section Header
// -------------------------------------

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SectionHeader = ({
  icon,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          bgcolor: "primary.50",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
};

export default JobDescriptionPage;