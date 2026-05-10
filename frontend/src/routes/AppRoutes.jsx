import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import CreateTrip from '../pages/CreateTrip.jsx';
import ItineraryBuilder from '../pages/ItineraryBuilder.jsx';
import MyTrips from '../pages/MyTrips.jsx';
import SearchExplorer from '../pages/SearchExplorer.jsx';
import UserProfile from '../pages/UserProfile.jsx';
import ItineraryView from '../pages/ItineraryView.jsx';
import PackingChecklist from '../pages/PackingChecklist.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function ProtectedMainRoute({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
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
        element={<ProtectedMainRoute><CreateTrip /></ProtectedMainRoute>}
      />
      <Route
        path="/trips/create"
        element={<ProtectedMainRoute><CreateTrip /></ProtectedMainRoute>}
      />
      <Route
        path="/my-trips"
        element={<ProtectedMainRoute><MyTrips /></ProtectedMainRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedMainRoute><UserProfile /></ProtectedMainRoute>}
      />
      <Route
        path="/explore"
        element={<ProtectedMainRoute><SearchExplorer /></ProtectedMainRoute>}
      />
      <Route
        path="/packing"
        element={<ProtectedMainRoute><PackingChecklist /></ProtectedMainRoute>}
      />
      <Route
        path="/trip/:tripId/packing"
        element={<ProtectedMainRoute><PackingChecklist /></ProtectedMainRoute>}
      />
      <Route
        path="/trip/:id/view"
        element={<ProtectedMainRoute><ItineraryView /></ProtectedMainRoute>}
      />
      <Route
        path="/trip/:id"
        element={<ProtectedMainRoute><ItineraryBuilder /></ProtectedMainRoute>}
      />
      <Route
        path="/trip/:id/itinerary"
        element={<ProtectedMainRoute><ItineraryBuilder /></ProtectedMainRoute>}
      />
    </Routes>
  );
}
