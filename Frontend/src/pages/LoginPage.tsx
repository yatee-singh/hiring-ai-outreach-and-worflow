import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { auth } from "../lib/auth";
import { API_URL } from "../config/api";

interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    organization: {
      id: string;
      name: string;
    };
  };
}

interface LoginErrorResponse {
  detail?: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

        const response = await fetch(`${API_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
      const data = await response.json();

      if (!response.ok) {
        const errorData = data as LoginErrorResponse;

        throw new Error(
          errorData.detail || "Login failed"
        );
      }

      const loginData = data as LoginResponse;

      auth.login(loginData.user);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            maxWidth: 440,
            mx: "auto",
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Hunar Recruiter OS
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Sign in to continue
            </Typography>
          </Box>
            <p>Use username: yatee, password: test123</p>
          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter password"
              autoComplete="current-password"
              margin="normal"
            />

            {/* Error */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                }}
              >
                {error}
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{ mr: 1 }}
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

