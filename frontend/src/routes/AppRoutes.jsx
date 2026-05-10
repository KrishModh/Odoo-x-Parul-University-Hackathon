import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import CreateTrip from '../pages/CreateTrip.jsx';
import ItineraryBuilder from '../pages/ItineraryBuilder.jsx';
import MyTrips from '../pages/MyTrips.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-trip"
        element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/create"
        element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-trips"
        element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip/:id"
        element={
          <ProtectedRoute>
            <ItineraryBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip/:id/itinerary"
        element={
          <ProtectedRoute>
            <ItineraryBuilder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
