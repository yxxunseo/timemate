import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import MySchedule from "./pages/schedule/MySchedule";
import ScheduleForm from "./pages/schedule/ScheduleForm";
import Groups from "./pages/groups/Groups";
import GroupDetail from "./pages/groups/GroupDetail";
import Friends from "./pages/friends/Friends";
import MyPage from "./pages/me/Mypage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={<Dashboard />}
        />
        <Route
          path="/schedule"
          element={<MySchedule />}
        />
        <Route
          path="/schedule/new"
          element={<ScheduleForm />}
        />
        <Route
          path="/groups"
          element={<Groups />}
        />
        <Route
          path="/groups/:id"
          element={<GroupDetail />}
        />
        <Route
          path="/friends"
          element={<Friends />}
        />
        <Route
          path="/me"
          element={<MyPage />}
        />
      </Route>
    </Routes>
  );
}
