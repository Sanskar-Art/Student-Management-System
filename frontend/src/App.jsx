import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentsPage from "./pages/StudentsPage";
import CoursesPage from "./pages/CoursesPage";
import EnrollmentsPage from "./pages/EnrollmentsPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
    </AuthProvider>
  );
}
