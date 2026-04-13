import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { supabase, hasSupabaseCredentials } from "./lib/supabaseClient.js";
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

    if (!hasSupabaseCredentials || !supabase) {
      setLoadingSession(false);
      return () => {
        isMounted = false;
      };
    }

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
    if (!supabase) return;
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

      {!hasSupabaseCredentials && (
        <div
          style={{
            margin: "1rem auto",
            maxWidth: "960px",
            padding: "1rem 1.25rem",
            borderRadius: "16px",
            background: "#fff3cd",
            color: "#664d03",
            border: "1px solid #ffecb5",
          }}
        >
          Demo-modus: inloggen en accountfuncties zijn uitgeschakeld omdat
          Supabase-omgevingsvariabelen niet zijn ingesteld op deze live versie.
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />

        <Route
          path="/login"
          element={
            hasSupabaseCredentials ? (
              isAuthenticated ? (
                <Navigate to="/my-account" replace />
              ) : (
                <LoginPage />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/create-account"
          element={
            hasSupabaseCredentials ? (
              isAuthenticated ? (
                <Navigate to="/my-account" replace />
              ) : (
                <CreateAccountPage />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/my-account"
          element={
            hasSupabaseCredentials ? (
              isAuthenticated ? (
                <MyAccountPage onLogout={handleLogout} session={session} />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}