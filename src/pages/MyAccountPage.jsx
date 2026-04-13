import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

function formatDate(dateValue) {
  if (!dateValue) return "Niet beschikbaar";

  try {
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch {
    return "Niet beschikbaar";
  }
}

export default function MyAccountPage({ onLogout, session }) {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setProfileError("");

        const userId = session?.user?.id;
        const userEmail = session?.user?.email || "";
        const fullName = session?.user?.user_metadata?.full_name || "";
        const phone = session?.user?.user_metadata?.phone || "";

        if (!userId) {
          setLoadingProfile(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          const { data: insertedProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              full_name: fullName,
              email: userEmail,
              phone,
            })
            .select()
            .maybeSingle();

          if (insertError) {
            throw insertError;
          }

          setProfile(insertedProfile);
        } else {
          setProfile(data);
        }
      } catch (error) {
        setProfileError(error.message || "Profiel kon niet geladen worden.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [session]);

  const displayName =
    profile?.full_name ||
    session?.user?.user_metadata?.full_name ||
    "Gebruiker";

  const displayEmail =
    profile?.email || session?.user?.email || "Niet beschikbaar";

  const displayPhone =
    profile?.phone || session?.user?.user_metadata?.phone || "Nog niet ingevuld";

  const accountFacts = useMemo(
    () => [
      {
        label: "Naam",
        value: loadingProfile ? "Laden..." : displayName,
      },
      {
        label: "E-mail",
        value: loadingProfile ? "Laden..." : displayEmail,
      },
      {
        label: "Telefoon",
        value: loadingProfile ? "Laden..." : displayPhone,
      },
      {
        label: "Account aangemaakt",
        value: formatDate(session?.user?.created_at),
      },
    ],
    [displayEmail, displayName, displayPhone, loadingProfile, session?.user?.created_at]
  );

  const accountStatus = useMemo(
    () => [
      {
        label: "Auth status",
        value: session?.user ? "Ingelogd" : "Niet ingelogd",
      },
      {
        label: "E-mail bevestigd",
        value: session?.user?.email_confirmed_at ? "Ja" : "Nog niet bevestigd",
      },
      {
        label: "Laatste login",
        value: formatDate(session?.user?.last_sign_in_at),
      },
      {
        label: "Profiel in database",
        value: loadingProfile ? "Controleren..." : profile ? "Gekoppeld" : "Nog niet gevonden",
      },
    ],
    [loadingProfile, profile, session?.user]
  );

  return (
    <main className="page page--account">
      <section className="account-hero">
        <div className="account-hero__content">
          <span className="eyebrow">Mijn account</span>
          <h1>Welkom terug, {loadingProfile ? "..." : displayName}</h1>
          <p>
            Dit accountscherm is nu opgeschoond: geen nep-data, geen demo-orders,
            maar alleen wat er echt al werkt met Supabase Auth en je profiel.
          </p>
        </div>

        <div className="account-hero__actions">
          <Link to="/" className="button button--ghost">
            Terug naar home
          </Link>

          <button
            type="button"
            className="button button--primary"
            onClick={onLogout}
          >
            Uitloggen
          </button>
        </div>
      </section>

      {profileError ? (
        <div className="status status--error">{profileError}</div>
      ) : null}

      <section className="account-grid">
        <article className="account-panel account-panel--wide">
          <div className="account-panel__header">
            <div>
              <h2>Profielgegevens</h2>
              <p>
                Deze gegevens komen uit je Supabase user en je <code>profiles</code>-tabel.
              </p>
            </div>
          </div>

          <div className="info-grid">
            {accountFacts.map((item) => (
              <div key={item.label} className="info-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="account-panel">
          <div className="account-panel__header">
            <div>
              <h2>Accountstatus</h2>
              <p>Alleen echte statusinformatie, zonder fictieve onderdelen.</p>
            </div>
          </div>

          <div className="status-list">
            {accountStatus.map((item) => (
              <div key={item.label} className="status-list__item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="account-panel">
          <div className="account-panel__header">
            <div>
              <h2>Wat werkt nu al?</h2>
              <p>Dit is de echte basis die nu al in je project zit.</p>
            </div>
          </div>

          <div className="feature-list">
            <div className="feature-list__item">
              <strong>Create account</strong>
              <span>Werkend met e-mailbevestiging</span>
            </div>

            <div className="feature-list__item">
              <strong>Login</strong>
              <span>Werkend via Supabase Auth</span>
            </div>

            <div className="feature-list__item">
              <strong>Homepage data</strong>
              <span>Live categorieën en recepten uit Supabase</span>
            </div>

            <div className="feature-list__item">
              <strong>Profielsync</strong>
              <span>Koppeling met de profiles-tabel</span>
            </div>
          </div>
        </article>

        <article className="account-panel">
          <div className="account-panel__header">
            <div>
              <h2>Logische vervolgstappen</h2>
              <p>Niet live, maar wél klaar om hier later op door te bouwen.</p>
            </div>
          </div>

          <div className="roadmap-list">
            <div className="roadmap-list__item">Recept detailpagina</div>
            <div className="roadmap-list__item">Favorieten per gebruiker</div>
            <div className="roadmap-list__item">Ebook pagina en aankoopflow</div>
            <div className="roadmap-list__item">Contactpagina met formulier</div>
            <div className="roadmap-list__item">Bestellingen en betalingen</div>
          </div>
        </article>
      </section>

      <section className="cta-banner cta-banner--account">
        <div>
          <span className="cta-banner__eyebrow">Verder bouwen</span>
          <h3>Je basis staat nu veel netter</h3>
          <p>
            Vanaf hier kun je rustig uitbreiden met echte recepten-detailpagina’s,
            klantenflows, ebooks, social media en later betalingen.
          </p>
        </div>

        <a href="/#recipes" className="button button--primary">
          Bekijk recepten
        </a>
      </section>
    </main>
  );
}