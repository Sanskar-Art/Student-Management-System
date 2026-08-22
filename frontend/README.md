# e-Registrar — Frontend

React.js frontend for the Student Management System API, styled as an academic registrar/records system.

## Stack
- React 19 + Vite
- MUI (custom theme — see `src/theme.js`)
- React Router
- Axios (with JWT interceptor)

## Setup
```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your API's URL
npm run dev
```

## Structure
```
src/
  api/          axios client + JWT interceptor, resource-grouped API calls
  context/      AuthContext (login/register/logout, role helpers)
  components/   AppLayout, ProtectedRoute, IdBadge, form/confirm dialogs
  pages/        Login, Register, Students, Courses, Enrollments
  theme.js      MUI theme (palette, typography)
```

## Design notes
- Palette: Ink Navy / Parchment / Ledger Green / Warm Amber — evokes a
  registrar's ledger rather than a generic admin template.
- Every record (student, course, enrollment) is tagged with a small
  monospace "catalog tab" ID badge (`IdBadge.jsx`) — the app's signature
  visual motif.
- Access is role-aware: Admin and Teacher can create/update; only Admin
  can delete. The UI hides actions the current user isn't permitted to
  perform (the API also enforces this server-side).

## Build
```bash
npm run build
```
Outputs to `dist/`.
