import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import AuthShell from "../components/AuthShell.jsx";
import AuthInput from "../components/AuthInput.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const nextErrors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: "",
    };

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Naam is verplicht.";
    } else if (form.fullName.trim().length < 2) {
      nextErrors.fullName = "Voer een geldige naam in.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "E-mailadres is verplicht.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Voer een geldig e-mailadres in.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Telefoonnummer is verplicht.";
    } else if (form.phone.trim().length < 8) {
      nextErrors.phone = "Voer een geldig telefoonnummer in.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Wachtwoord is verplicht.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Wachtwoord moet minimaal 8 tekens zijn.";
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Bevestig je wachtwoord.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Wachtwoorden komen niet overeen.";
    }

    if (!form.agree) {
      nextErrors.agree = "Je moet akkoord gaan om door te gaan.";
    }

    return nextErrors;
  }, [form]);

  const isFormValid =
    !errors.fullName &&
    !errors.email &&
    !errors.phone &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.agree;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSubmitStatus({ type: "", message: "" });
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agree: true,
    });

    setSubmitStatus({ type: "", message: "" });

    if (!isFormValid) {
      return;
    }

    try {
      setLoading(true);

      const email = form.email.trim().toLowerCase();
      const fullName = form.fullName.trim();
      const phone = form.phone.trim();

      const { error } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        throw error;
      }

      setSubmitStatus({
        type: "success",
        message:
          "Er is een bevestigingsmail verzonden. Bevestig eerst je e-mailadres en log daarna in.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2200);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Er ging iets mis bij het aanmaken van je account.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Maak je account aan"
      description="Een nette basis voor jouw receptenplatform: accountbeheer, authenticatie en later ook uitbreidingen zoals ebooks, favorieten en betalingen."
      highlights={[
        "Veilige accountflow met e-mailbevestiging",
        "Jouw profielgegevens direct gekoppeld aan Supabase",
        "Logische basis voor latere groei van het platform",
      ]}
    >
      <div className="panel-header">
        <h2>Create account</h2>
        <p>Vul je gegevens in om je account aan te maken.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Volledige naam"
          id="fullName"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Bijv. Yassine Alami"
          autoComplete="name"
          error={touched.fullName ? errors.fullName : ""}
        />

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
          label="Telefoonnummer"
          id="phone"
          name="phone"
          type="text"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="06 12345678"
          autoComplete="tel"
          error={touched.phone ? errors.phone : ""}
        />

        <AuthInput
          label="Wachtwoord"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Minimaal 8 tekens"
          autoComplete="new-password"
          error={touched.password ? errors.password : ""}
          rightElement={
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Verberg" : "Toon"}
            </button>
          }
        />

        <AuthInput
          label="Bevestig wachtwoord"
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Herhaal je wachtwoord"
          autoComplete="new-password"
          error={touched.confirmPassword ? errors.confirmPassword : ""}
          rightElement={
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Verberg" : "Toon"}
            </button>
          }
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span>Ik ga akkoord met het aanmaken van mijn account.</span>
        </label>

        {touched.agree && errors.agree ? (
          <p className="field__error">{errors.agree}</p>
        ) : null}

        {submitStatus.message ? (
          <div className={`status status--${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        ) : null}

        <button
          type="submit"
          className="button button--primary button--full"
          disabled={loading}
        >
          {loading ? "Account aanmaken..." : "Account aanmaken"}
        </button>

        <p className="auth-footer">
          Heb je al een account? <Link to="/login">Log hier in</Link>
        </p>
      </form>
    </AuthShell>
  );
}