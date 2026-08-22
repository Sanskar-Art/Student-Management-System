import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teacher");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, password, role);
      navigate("/students", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the account.");
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
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 400,
          p: 4,
          border: `1px solid ${tokens.hairline}`,
          borderTop: `4px solid ${tokens.amber}`,
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <SchoolIcon sx={{ color: tokens.ledgerGreen, fontSize: 32 }} />
          <Typography variant="h5" sx={{ color: tokens.inkNavy }}>
            Create account
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.slate, textAlign: "center" }}>
            Register as staff to manage student records
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
            helperText="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Typography variant="body2" sx={{ mt: 2, mb: 1, color: tokens.slate }}>
            Role
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            fullWidth
            onChange={(e, val) => val && setRole(val)}
          >
            <ToggleButton value="Teacher">Teacher</ToggleButton>
            <ToggleButton value="Admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 3, py: 1.2 }}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: tokens.slate }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" sx={{ color: tokens.ledgerGreen, fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
