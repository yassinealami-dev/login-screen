import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { supabase } from "./lib/supabaseClient.js";
import AppNavbar from "./components/AppNavbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import MyAccountPage from "./pages/MyAccountPage.jsx";

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setSession(currentSession);
        setLoadingSession(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoadingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isAuthenticated = Boolean(session?.user);

  if (loadingSession) {
    return (
      <main className="app-loading">
        <div className="app-loading__card">
          <span className="app-loading__badge">Alami Recepten</span>
          <h1>Even laden...</h1>
          <p>We controleren je sessie en maken de website klaar.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <AppNavbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/my-account" replace /> : <LoginPage />
          }
        />

        <Route
          path="/create-account"
          element={
            isAuthenticated ? (
              <Navigate to="/my-account" replace />
            ) : (
              <CreateAccountPage />
            )
          }
        />

        <Route
          path="/my-account"
          element={
            isAuthenticated ? (
              <MyAccountPage onLogout={handleLogout} session={session} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}