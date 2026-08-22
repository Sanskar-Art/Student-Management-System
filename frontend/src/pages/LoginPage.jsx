import { useState } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Stack,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      const redirectTo = location.state?.from?.pathname || "/students";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not sign in. Check your username and password."
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
        backgroundColor: tokens.parchment,
        backgroundImage:
          `repeating-linear-gradient(0deg, rgba(28,37,65,0.035) 0px, rgba(28,37,65,0.035) 1px, transparent 1px, transparent 32px)`,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 380,
          p: 4,
          border: `1px solid ${tokens.hairline}`,
          borderTop: `4px solid ${tokens.ledgerGreen}`,
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <SchoolIcon sx={{ color: tokens.ledgerGreen, fontSize: 32 }} />
          <Typography variant="h5" sx={{ color: tokens.inkNavy }}>
            e-Registrar
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.slate }}>
            Sign in to manage student records
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            required
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.2 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: tokens.slate }}>
          New here?{" "}
          <Link component={RouterLink} to="/register" sx={{ color: tokens.ledgerGreen, fontWeight: 600 }}>
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
