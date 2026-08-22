import { useState } from "react";
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

export default function CourseFormDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ courseCode: "", courseName: "", credits: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        courseCode: form.courseCode.trim(),
        courseName: form.courseName.trim(),
        credits: Number(form.credits),
      });
      setForm({ courseCode: "", courseName: "", credits: "" });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif' }}>Add course</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Course code"
            placeholder="e.g. CS301"
            fullWidth
            required
            margin="dense"
            value={form.courseCode}
            onChange={handleChange("courseCode")}
            autoFocus
          />
          <TextField
            label="Course name"
            fullWidth
            required
            margin="dense"
            value={form.courseName}
            onChange={handleChange("courseName")}
          />
          <TextField
            label="Credits"
            type="number"
            fullWidth
            required
            margin="dense"
            inputProps={{ min: 1, max: 10 }}
            value={form.credits}
            onChange={handleChange("credits")}
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
