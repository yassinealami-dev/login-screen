import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import AuthInput from "./AuthInput.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordResetModal({ open, email, onClose }) {
  const [recoveryEmail, setRecoveryEmail] = useState(email || "");
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setRecoveryEmail(email || "");
    setError("");
    setStatus({ type: "", message: "" });
    setLoading(false);
  }, [open, email]);

  if (!open) {
    return null;
  }

  const validate = () => {
    if (!recoveryEmail.trim()) {
      return "E-mailadres is verplicht.";
    }

    if (!EMAIL_REGEX.test(recoveryEmail.trim())) {
      return "Voer een geldig e-mailadres in.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    setError(validationError);
    setStatus({ type: "", message: "" });

    if (validationError) {
      return;
    }

    try {
      setLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        recoveryEmail.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/login`,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setStatus({
        type: "success",
        message: "De resetlink is verzonden. Controleer je inbox.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Er ging iets mis bij het versturen van de resetlink.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div>
            <h2 id="forgot-password-title">Wachtwoord resetten</h2>
            <p className="modal__subtitle">
              Vul je e-mailadres in en we sturen je een resetlink.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit} noValidate>
          <AuthInput
            label="E-mailadres"
            id="recoveryEmail"
            name="recoveryEmail"
            type="email"
            value={recoveryEmail}
            onChange={(event) => {
              setRecoveryEmail(event.target.value);
              if (error) setError("");
            }}
            onBlur={() => setError(validate())}
            placeholder="jij@example.com"
            autoComplete="email"
            error={error}
          />

          {status.message ? (
            <div
              className={`status status--${status.type}`}
              role={status.type === "error" ? "alert" : "status"}
            >
              {status.message}
            </div>
          ) : null}

          <div className="modal__actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={onClose}
            >
              Annuleren
            </button>

            <button
              type="submit"
              className="button button--primary"
              disabled={loading}
            >
              {loading ? "Versturen..." : "Resetlink sturen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}