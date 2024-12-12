import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Toastify from "./components/Toastify";
import { UserProvider } from "./services/UserContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Student from "./pages/Students";
import Appointments from "./pages/Appointment";
import UserApproval from "./pages/UserApproval";
import Monitoring from "./pages/Monitoring";
import History from "./pages/History";
import StudentList from "./pages/StudentList";

import NavigationBar from "./components/NavigationBar";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const location = useLocation();

  const hideNavBar = location.pathname === "/";

  return (
    <>
      {!hideNavBar && <NavigationBar />}
      <Toastify />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/user_approval"
          element={
            <PrivateRoute>
              <UserApproval />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring"
          element={
            <PrivateRoute>
              <Monitoring />
            </PrivateRoute>
          }
        />
        <Route
          path="/student"
          element={
            <PrivateRoute>
              <Student />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/student_list"
          element={
            <PrivateRoute>
              <StudentList />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <main
      className="login-bg"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Colon Mono, monospace",
      }}
    >
      <div className="content">
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
        </UserProvider>
      </div>
    </main>
  );
}

export default App;
