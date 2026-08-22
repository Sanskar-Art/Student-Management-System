import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material";

const emptyForm = { name: "", email: "", contactNumber: "", age: "" };

export default function StudentFormDialog({ open, student, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setForm(
        student
          ? {
              name: student.name,
              email: student.email,
              contactNumber: String(student.contactNumber),
              age: String(student.age),
            }
          : emptyForm
      );
    }
  }, [open, student]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        contactNumber: Number(form.contactNumber),
        age: Number(form.age),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this student record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif' }}>
        {student ? "Edit student" : "Add student"}
      </DialogTitle>
      <Stack component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Full name"
            fullWidth
            required
            margin="dense"
            value={form.name}
            onChange={handleChange("name")}
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="dense"
            value={form.email}
            onChange={handleChange("email")}
          />
          <TextField
            label="Contact number"
            type="tel"
            fullWidth
            required
            margin="dense"
            value={form.contactNumber}
            onChange={handleChange("contactNumber")}
          />
          <TextField
            label="Age"
            type="number"
            fullWidth
            required
            margin="dense"
            inputProps={{ min: 1, max: 120 }}
            value={form.age}
            onChange={handleChange("age")}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
