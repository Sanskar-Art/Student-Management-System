import apiClient from "./apiClient";

export const authApi = {
  login: (username, password) =>
    apiClient.post("/auth/login", { username, password }),
  register: (username, password, role) =>
    apiClient.post("/auth/register", { username, password, role }),
};

export const studentApi = {
  list: ({ search = "", sortBy = "name", sortDesc = false, page = 1, pageSize = 10 } = {}) =>
    apiClient.get("/student", { params: { search, sortBy, sortDesc, page, pageSize } }),
  get: (id) => apiClient.get(`/student/${id}`),
  create: (data) => apiClient.post("/student", data),
  update: (id, data) => apiClient.put(`/student/${id}`, data),
  remove: (id) => apiClient.delete(`/student/${id}`),
};

export const courseApi = {
  list: () => apiClient.get("/course"),
  create: (data) => apiClient.post("/course", data),
  remove: (id) => apiClient.delete(`/course/${id}`),
};

export const enrollmentApi = {
  byStudent: (studentId) => apiClient.get(`/enrollment/student/${studentId}`),
  byCourse: (courseId) => apiClient.get(`/enrollment/course/${courseId}`),
  create: (data) => apiClient.post("/enrollment", data),
  assignGrade: (id, grade) => apiClient.put(`/enrollment/${id}/grade`, { grade }),
  remove: (id) => apiClient.delete(`/enrollment/${id}`),
};
