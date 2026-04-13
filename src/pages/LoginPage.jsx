import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import AuthShell from "../components/AuthShell.jsx";
import AuthInput from "../components/AuthInput.jsx";
import PasswordResetModal from "../components/PasswordResetModal.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState({ type: "", message: "" });
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const errors = useMemo(() => {
    const nextErrors = {
      email: "",
      password: "",
    };

    if (!form.email.trim()) {
      nextErrors.email = "E-mailadres is verplicht.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Voer een geldig e-mailadres in.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Wachtwoord is verplicht.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Wachtwoord moet minimaal 8 tekens zijn.";
    }

    return nextErrors;
  }, [form.email, form.password]);

  const isFormValid = !errors.email && !errors.password;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setLoginStatus({ type: "", message: "" });
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    setLoginStatus({ type: "", message: "" });

    if (!isFormValid) {
      return;
    }

    try {
      setLoginLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) {
        throw error;
      }

      setLoginStatus({
        type: "success",
        message: "Succesvol ingelogd. Je wordt doorgestuurd...",
      });

      setTimeout(() => {
        navigate("/my-account");
      }, 700);
    } catch (error) {
      setLoginStatus({
        type: "error",
        message: error.message || "Inloggen is niet gelukt.",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <AuthShell
        title="Welkom terug"
        description="Log in om je account, profiel en toekomstige functies vanuit één centrale plek te beheren."
        highlights={[
          "Echte login via Supabase Auth",
          "Sterke basis voor recepten, ebook en betalingen",
          "Rustige en duidelijke accountflow",
        ]}
      >
        <div className="panel-header">
          <h2>Login</h2>
          <p>Vul je gegevens in om je account te openen.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <AuthInput
            label="E-mailadres"
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="jij@example.com"
            autoComplete="email"
            error={touched.email ? errors.email : ""}
          />

          <AuthInput
            label="Wachtwoord"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Vul je wachtwoord in"
            autoComplete="current-password"
            error={touched.password ? errors.password : ""}
            rightElement={
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
              >
                {showPassword ? "Verberg" : "Toon"}
              </button>
            }
          />

          <div className="auth-options">
            <button
              type="button"
              className="text-button"
              onClick={() => setRecoveryOpen(true)}
            >
              Wachtwoord vergeten?
            </button>
          </div>

          {loginStatus.message ? (
            <div
              className={`status status--${loginStatus.type}`}
              role={loginStatus.type === "error" ? "alert" : "status"}
            >
              {loginStatus.message}
            </div>
          ) : null}

          <button
            type="submit"
            className="button button--primary button--full"
            disabled={loginLoading}
          >
            {loginLoading ? "Bezig met inloggen..." : "Inloggen"}
          </button>

          <p className="auth-footer">
            Nog geen account? <Link to="/create-account">Maak er één aan</Link>
          </p>
        </form>
      </AuthShell>

      <PasswordResetModal
        open={recoveryOpen}
        email={form.email}
        onClose={() => setRecoveryOpen(false)}
      />
    </>
  );
}