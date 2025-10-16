import { Routes, Route, Navigate } from "react-router-dom";

import Header from "@components/Header";
import RequestRole from "@components/UserAccess/RequestRole";
import Login from "@components/UserAccess/Login";
import DashboardRouter from "@components/Dashboard";
import AdminPanel from "@components/Admin";
import RouteLayout from "./layout/RouteLayout";

const App = () => {
  console.log("++++++++++++App rendered");
  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RouteLayout />}>
          <Route path="/request-role" element={<RequestRole />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/roles" element={<div>Roles page ...</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
