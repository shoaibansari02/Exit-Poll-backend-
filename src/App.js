// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CitiesPage from "./pages/CitiesPage";
import ZonesPage from "./pages/ZonesPage";
import CandidatesPage from "./pages/CandidatesPage";
import MediaPage from "./pages/MediaPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/zones" element={<ZonesPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/media" element={<MediaPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
