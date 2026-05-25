import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOTP from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import Merchants from "./pages/Merchants.jsx";
import Pools from "./pages/Pools.jsx";
import Reserves from "./pages/Reserves.jsx";
import Controls from "./pages/Controls.jsx";
import Governance from "./pages/Governance.jsx";
import ActivityPage from "./pages/Activity.jsx";
import Settings from "./pages/Settings";
import { Toaster } from "./components/ui/sonner";
import { AppLayout } from "./components/AppLayout";
import { Mappings } from "./components/mappings/Mapping";
// import { SlackWorkFlow } from "./components/Slack";
import { IssueIntake } from './components/featureBug';
import { BugReport } from './components/bugReport';
import { UsersPage } from './components/Users';
import { useAuthStore } from "./stores/authStore";
import { TreasuryLayout } from "./components/treasury/TreasuryLayout";

function RequireAuth({ children }) {
  const status = useAuthStore((s) => s.status);
  if (status !== "authenticated") return <Navigate to="/login" replace />;
  return children;
}

function RequirePendingEmailOtp({ children }) {
  const status = useAuthStore((s) => s.status);
  if (status !== "pendingEmailOtp") return <Navigate to="/login" replace />;
  return children;
}

function RequirePendingTotp({ children }) {
  const status = useAuthStore((s) => s.status);
  if (status !== "pendingTotp") return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes (no sidebar, no AppLayout) */}
          <Route
            path="/login"
            element={
              status === "authenticated" ? (
                <Navigate to="/dashboard" replace />
              ) : status === "pendingEmailOtp" ? (
                <Navigate to="/verify-email" replace />
              ) : status === "pendingTotp" ? (
                <Navigate to="/verify-otp" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/verify-email"
            element={
              status === "authenticated" ? (
                <Navigate to="/dashboard" replace />
              ) : status === "pendingTotp" ? (
                <Navigate to="/verify-otp" replace />
              ) : (
                <RequirePendingEmailOtp>
                  <VerifyEmail />
                </RequirePendingEmailOtp>
              )
            }
          />
          <Route
            path="/verify-otp"
            element={
              status === "authenticated" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RequirePendingTotp>
                  <VerifyOTP />
                </RequirePendingTotp>
              )
            }
          />

          <Route
            path="/"
            element={<Navigate to={status === "authenticated" ? "/dashboard" : "/login"} replace />}
          />
          <Route
            element={
              <RequireAuth>
                <TreasuryLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/reserves" element={<Reserves />} />
            <Route path="/controls" element={<Controls />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/merchants" element={<Merchants />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Protected routes (with sidebar via AppLayout) */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/feature" element={<IssueIntake />} />
            <Route path="/bugs" element={<BugReport />} />
            <Route path="/mappings" element={<Mappings />} />
            {/* <Route path="/slack" element={<SlackWorkFlow />} /> */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
