import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@pages/ProtectedRoute";
import Header from "@components/Header";
import RequestRole from "@components/UserAccess/RequestRole";
import Login from "@components/UserAccess/Login";
import DashboardRouter from "@pages/DahsboardRouter";

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/request-role"
          element={
            <ProtectedRoute requireRole={false}>
              <RequestRole />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roles"
          element={<div>Roles page en construcción...</div>}
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
