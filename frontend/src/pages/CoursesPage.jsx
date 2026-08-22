import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Stack,
  Alert,
  Chip,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { courseApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";
import IdBadge from "../components/IdBadge";
import CourseFormDialog from "../components/CourseFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CoursesPage() {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await courseApi.list();
      setCourses(data);
    } catch {
      setError("Could not load courses. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreate = async (values) => {
    await courseApi.create(values);
    await fetchCourses();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await courseApi.remove(deleteTarget.courseID);
      setDeleteTarget(null);
      await fetchCourses();
    } catch {
      setError("Could not remove this course.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: tokens.inkNavy }}>
            Courses
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.slate }}>
            {courses.length} course{courses.length === 1 ? "" : "s"} in the catalog
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            Add course
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ border: `1px solid ${tokens.hairline}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Course name</TableCell>
              <TableCell>Credits</TableCell>
              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" sx={{ color: tokens.slate, py: 3, textAlign: "center" }}>
                    No courses in the catalog yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              courses.map((course) => (
                <TableRow key={course.courseID}>
                  <TableCell>
                    <IdBadge prefix="CRS" value={course.courseID} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.courseCode}
                      size="small"
                      sx={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        backgroundColor: "rgba(47,111,94,0.1)",
                        color: tokens.ledgerGreen,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setDeleteTarget(course)}>
                        <DeleteIcon fontSize="small" sx={{ color: "#B3432B" }} />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <CourseFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove course?"
        message={`This will permanently remove "${deleteTarget?.courseName}" and all of its enrollments.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Box>
  );
}
