import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ConcertList from './pages/user/ConcertList';
import ConcertDetail from './pages/user/ConcertDetail';
import SeatSelection from './pages/user/SeatSelection';
import Checkout from './pages/user/Checkout';
import Payment from './pages/user/Payment';
import BookingSuccess from './pages/user/BookingSuccess';
import MyTickets from './pages/user/MyTickets';
import TicketDetail from './pages/user/TicketDetail';
import Profile from './pages/user/Profile';
import Notifications from './pages/user/Notifications';
import Favorites from './pages/user/Favorites';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageConcerts from './pages/admin/ManageConcerts';
import ManageVenues from './pages/admin/ManageVenues';
import ManageUsers from './pages/admin/ManageUsers';
import Analytics from './pages/admin/Analytics';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/concerts" element={<ConcertList />} />
      <Route path="/concerts/:slug" element={<ConcertDetail />} />

      {/* Protected User Routes */}
      <Route path="/booking/seat-selection" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
      <Route path="/booking/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/booking/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/booking/success/:id" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
      <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
      <Route path="/my-tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="concerts" element={<ManageConcerts />} />
        <Route path="venues" element={<ManageVenues />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
