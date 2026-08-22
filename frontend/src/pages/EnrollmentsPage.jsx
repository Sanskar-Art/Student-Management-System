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
  Stack,
  Alert,
  Autocomplete,
  TextField,
  IconButton,
  Skeleton,
  Divider,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { studentApi, courseApi, enrollmentApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";
import IdBadge from "../components/IdBadge";
import ConfirmDialog from "../components/ConfirmDialog";

export default function EnrollmentsPage() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  const [rosterCourse, setRosterCourse] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPickerData = useCallback(async () => {
    const [studentsRes, coursesRes] = await Promise.all([
      studentApi.list({ pageSize: 500 }),
      courseApi.list(),
    ]);
    setStudents(studentsRes.data.items);
    setCourses(coursesRes.data);
  }, []);

  useEffect(() => {
    loadPickerData();
  }, [loadPickerData]);

  const loadRoster = useCallback(async (course) => {
    if (!course) {
      setRoster([]);
      return;
    }
    setRosterLoading(true);
    try {
      const { data } = await enrollmentApi.byCourse(course.courseID);
      setRoster(data);
      setGradeDrafts(Object.fromEntries(data.map((e) => [e.enrollmentID, e.grade || ""])));
    } finally {
      setRosterLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoster(rosterCourse);
  }, [rosterCourse, loadRoster]);

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) return;
    setEnrolling(true);
    setEnrollError("");
    try {
      await enrollmentApi.create({
        studentID: selectedStudent.studentID,
        courseID: selectedCourse.courseID,
      });
      setSelectedStudent(null);
      if (rosterCourse?.courseID === selectedCourse.courseID) {
        await loadRoster(selectedCourse);
      }
    } catch (err) {
      setEnrollError(err.response?.data?.message || "Could not enroll this student.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleSaveGrade = async (enrollmentId) => {
    const grade = gradeDrafts[enrollmentId];
    await enrollmentApi.assignGrade(enrollmentId, grade);
    await loadRoster(rosterCourse);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await enrollmentApi.remove(deleteTarget.enrollmentID);
      setDeleteTarget(null);
      await loadRoster(rosterCourse);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: tokens.inkNavy, mb: 3 }}>
        Enrollments
      </Typography>

      <Paper elevation={0} sx={{ border: `1px solid ${tokens.hairline}`, p: 3, mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Enroll a student in a course
        </Typography>

        {enrollError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {enrollError}
          </Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <Autocomplete
            options={students}
            getOptionLabel={(s) => `${s.name} (${s.email})`}
            value={selectedStudent}
            onChange={(e, val) => setSelectedStudent(val)}
            sx={{ flex: 1, width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Student" size="small" />}
          />
          <Autocomplete
            options={courses}
            getOptionLabel={(c) => `${c.courseCode} — ${c.courseName}`}
            value={selectedCourse}
            onChange={(e, val) => setSelectedCourse(val)}
            sx={{ flex: 1, width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Course" size="small" />}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            onClick={handleEnroll}
            disabled={!selectedStudent || !selectedCourse || enrolling}
            sx={{ whiteSpace: "nowrap" }}
          >
            {enrolling ? "Enrolling…" : "Enroll"}
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ mb: 3, borderColor: tokens.hairline }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Course roster
      </Typography>

      <Autocomplete
        options={courses}
        getOptionLabel={(c) => `${c.courseCode} — ${c.courseName}`}
        value={rosterCourse}
        onChange={(e, val) => setRosterCourse(val)}
        sx={{ maxWidth: 420, mb: 2 }}
        renderInput={(params) => <TextField {...params} label="Select a course to view its roster" size="small" />}
      />

      {rosterCourse && (
        <Paper elevation={0} sx={{ border: `1px solid ${tokens.hairline}` }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Enrolled on</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rosterLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!rosterLoading && roster.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" sx={{ color: tokens.slate, py: 3, textAlign: "center" }}>
                      No students enrolled in this course yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!rosterLoading &&
                roster.map((enrollment) => (
                  <TableRow key={enrollment.enrollmentID}>
                    <TableCell>
                      <IdBadge prefix="ENR" value={enrollment.enrollmentID} />
                    </TableCell>
                    <TableCell>{enrollment.studentName}</TableCell>
                    <TableCell>{new Date(enrollment.enrolledOn).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="—"
                        sx={{ width: 70 }}
                        value={gradeDrafts[enrollment.enrollmentID] ?? ""}
                        onChange={(e) =>
                          setGradeDrafts({ ...gradeDrafts, [enrollment.enrollmentID]: e.target.value })
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleSaveGrade(enrollment.enrollmentID)}
                        sx={{ ml: 0.5, color: tokens.ledgerGreen }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      {isAdmin && (
                        <IconButton size="small" onClick={() => setDeleteTarget(enrollment)}>
                          <DeleteIcon fontSize="small" sx={{ color: "#B3432B" }} />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove enrollment?"
        message={`This will unenroll ${deleteTarget?.studentName} from this course.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Box>
  );
}
