import React, { useState } from "react";
import {
  HomePage,
  AuthPage,
  DashboardLayout,
  DashboardHome,
  HealthDataPage,
  ReportsPage,
  MedicinePage,
  AIPage,
  PredictionsPage,
  SettingsPage,
} from "./pages";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MOCK_USER } from "./constants";

// Load Google Fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700;800;900&family=Red+Hat+Text:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

function AppContent() {
  const { isAuthenticated, user, loading, login, logout } = useAuth();
  const [dashPage, setDashPage] = useState("dashboard");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>Loading...</div>;
  }

  const renderDash = () => {
    switch (dashPage) {
      case "dashboard":
        return <DashboardHome onNavigate={setDashPage} />;
      case "health":
        return <HealthDataPage />;
      case "reports":
        return <ReportsPage />;
      case "medicines":
        return <MedicinePage />;
      case "ai":
        return <AIPage />;
      case "predictions":
        return <PredictionsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardHome onNavigate={setDashPage} />;
    }
  };

  // If not authenticated, show landing page with login modal option
  if (!isAuthenticated) {
    return (
      <>
        <HomePage onGetStarted={() => setShowAuthModal(true)} />
        {showAuthModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16,
            }}
            onClick={(e) => {
              // Close modal only if clicking on the overlay, not the card
              if (e.target === e.currentTarget) {
                setShowAuthModal(false);
              }
            }}
          >
            <style>{`
              .auth-modal-container {
                max-height: 90vh;
                overflow-y: auto;
                overflow-x: hidden;
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .auth-modal-container::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div style={{ position: 'relative' }} className="auth-modal-container">
              <AuthPage 
                onLogin={async (userData) => {
                  try {
                    // Call backend demo-login endpoint to get a real JWT token
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const loginResponse = await fetch(`${apiUrl}/auth/demo-login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: userData.email,
                        password: 'demo-password' // Not used in demo mode
                      })
                    });
                    
                    if (loginResponse.ok) {
                      const { data } = await loginResponse.json();
                      login(data.token, data.user);
                    } else {
                      // Fallback: create a demo token if endpoint fails
                      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
                      const payload = btoa(JSON.stringify({ 
                        id: userData.id,
                        email: userData.email,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
                      }));
                      const signature = btoa('demo');
                      const token = `${header}.${payload}.${signature}`;
                      login(token, userData);
                    }
                  } catch (err) {
                    console.error('Login error:', err);
                    // Still allow login for demo purposes
                    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
                    const payload = btoa(JSON.stringify({ 
                      id: userData.id,
                      email: userData.email,
                      iat: Math.floor(Date.now() / 1000),
                      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
                    }));
                    const signature = btoa('demo');
                    const token = `${header}.${payload}.${signature}`;
                    login(token, userData);
                  }
                  setShowAuthModal(false);
                }} 
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // If authenticated, show dashboard
  return (
    <DashboardLayout
      activePage={dashPage}
      onNavigate={setDashPage}
      onLogout={() => {
        logout();
        setDashPage("dashboard");
      }}
      user={user || MOCK_USER}
    >
      {renderDash()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
