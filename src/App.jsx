import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthVerify from './services/auth/AuthVerify.js';
import LoginCard from './components/auth/LoginCard.jsx';
import { Provider, useSelector } from 'react-redux';
import { store } from './services/store/store.js';
import SignUpCard from './components/auth/SignUpCard.tsx';
import NavBar from './components/NavBar.jsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import PrivateLayout from './components/Layout/PrivateLayout';
import {
  HomePage,
  FinancialsPage,
  PropertiesPage,
  RentalDetailPage,
  RentalsPage,
  TenantsPage,
  CalendarPage,
  TenantProfilePage,
  ExplorerPage,
  PropertyCreationPage,
  TenantCreationPage,
  AccountPage,
  MessagesPage,
  MaintenancePage,
} from './pages/WrappedPages.jsx';
import PropertyDetailsPage from './pages/PropertyDetailsPage.jsx';
import ContactUs from './pages/ContactUs';
import WhoWeAre from './pages/WhoWeAre.jsx';
import OurTeam from './pages/OurTeam.jsx';
import Services from './pages/Services.jsx';
import AdminUpload from './pages/AdminUpload.jsx';
import AdminMaintenance from './pages/AdminMaintenance.jsx';
import ServiceRequests from './pages/ServiceRequests.tsx';
import { useSocket } from './services/hooks/useSocket.js';
import SocketContext from './services/contexts/SocketContext.js';
import { ThemeProvider } from './services/contexts/ThemeContext.tsx';

// --- Route guard for landing vs. app ---
const LandingRoute = () => {
  const isLoggedIn = useSelector(state => !!state.authSlice.accessToken);
  return isLoggedIn ? <Navigate to="/home" replace /> : <LandingPage />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
        <AuthVerify />
      </Provider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const token = useSelector(state => state.authSlice.accessToken);
  const isLoggedIn = !!token;
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>
      <TooltipProvider>
        {!isLoggedIn && <NavBar />}
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/signup" element={<SignUpCard />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/services" element={<Services />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Private pages – wrapped with sidebar layout */}
          <Route element={<PrivateLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/create" element={<PropertyCreationPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/tenants/create" element={<TenantCreationPage />} />
            <Route path="/tenants/:id" element={<TenantProfilePage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/rentals/:id" element={<RentalDetailPage />} />
            <Route path="/financials" element={<FinancialsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/admin/upload" element={<AdminUpload />} />
            <Route path="/admin/maintenance" element={<AdminMaintenance />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/settings" element={<AccountPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={isLoggedIn ? <NotFound /> : <Navigate to="/login" replace />} />
        </Routes>
      </TooltipProvider>
    </SocketContext.Provider>
  );
};

export default App;
