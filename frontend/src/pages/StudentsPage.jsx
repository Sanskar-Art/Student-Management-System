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
  TableSortLabel,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Stack,
  TablePagination,
  Alert,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { studentApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";
import IdBadge from "../components/IdBadge";
import StudentFormDialog from "../components/StudentFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function StudentsPage() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDesc, setSortDesc] = useState(false);
  const [page, setPage] = useState(0); // zero-indexed for MUI TablePagination
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await studentApi.list({
        search,
        sortBy,
        sortDesc,
        page: page + 1,
        pageSize,
      });
      setRows(data.items);
      setTotalCount(data.totalCount);
    } catch {
      setError("Could not load students. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortDesc, page, pageSize]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc((d) => !d);
    } else {
      setSortBy(column);
      setSortDesc(false);
    }
  };

  const openCreate = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values) => {
    if (editingStudent) {
      await studentApi.update(editingStudent.studentID, values);
    } else {
      await studentApi.create(values);
    }
    await fetchStudents();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentApi.remove(deleteTarget.studentID);
      setDeleteTarget(null);
      await fetchStudents();
    } catch {
      setError("Could not remove this student.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: tokens.inkNavy }}>
            Students
          </Typography>
          <Typography variant="body2" sx={{ color: tokens.slate }}>
            {totalCount} record{totalCount === 1 ? "" : "s"} on file
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add student
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: `1px solid ${tokens.hairline}`, mb: 2, p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: tokens.slate }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

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
              <TableCell sortDirection={sortBy === "name" ? (sortDesc ? "desc" : "asc") : false}>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortDesc ? "desc" : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell sortDirection={sortBy === "age" ? (sortDesc ? "desc" : "asc") : false}>
                <TableSortLabel
                  active={sortBy === "age"}
                  direction={sortDesc ? "desc" : "asc"}
                  onClick={() => handleSort("age")}
                >
                  Age
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" sx={{ color: tokens.slate, py: 3, textAlign: "center" }}>
                    No students match this search. Try a different name or email, or add a new
                    record.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              rows.map((student) => (
                <TableRow key={student.studentID}>
                  <TableCell>
                    <IdBadge prefix="STU" value={student.studentID} />
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(student)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {isAdmin && (
                      <IconButton size="small" onClick={() => setDeleteTarget(student)}>
                        <DeleteIcon fontSize="small" sx={{ color: "#B3432B" }} />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <StudentFormDialog
        open={formOpen}
        student={editingStudent}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove student?"
        message={`This will permanently remove ${deleteTarget?.name} and their enrollment history.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Box>
  );
}
