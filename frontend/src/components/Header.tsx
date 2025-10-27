import { useState } from "react";
import { FiGithub, FiSun, FiMoon, FiSettings } from "react-icons/fi";
import Logo from "../assets/OptimalCVLogo.svg";

type HeaderProps = {
  onNavigate?: (route: string) => void;
  active?: "#/" | "#/generator" | "#/api";
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
  onSettingsClick?: () => void;
};

export default function Header({
  onNavigate,
  active,
  theme = "dark",
  onThemeToggle,
  onSettingsClick,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const current = (active ||
    (typeof window !== "undefined" ? (window.location.hash as any) : "#/")) as
    | "#/"
    | "#/generator"
    | "#/api";

  return (
    <header className="acv-header-sticky print:hidden">
      <div className="acv-container">
        <div className="acv-header-glass">
          {/* Logo Section */}
          <a
            href="#/"
            className="acv-logo-container group"
            onClick={() => onNavigate?.("#/")}
          >
            <div className="acv-logo-wrapper">
              <img src={Logo} alt="OptimalCV" className="acv-logo-img" />
              <div className="acv-logo-shine"></div>
            </div>
            <div className="acv-logo-text">
              <div className="acv-logo-title">OptimalCV</div>
              <div className="acv-logo-subtitle">AI-Powered CV Generation</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="acv-nav-desktop">
            <div className="acv-nav-items">
              <NavItem
                label="Home"
                active={current === "#/"}
                onClick={() => onNavigate?.("#/")}
              />
              <NavItem
                label="Generator"
                active={current === "#/generator"}
                onClick={() => onNavigate?.("#/generator")}
              />
              <NavItem
                label="API"
                active={current === "#/api"}
                onClick={() => onNavigate?.("#/api")}
              />
            </div>

            <div className="acv-nav-actions">
              <button
                onClick={onSettingsClick}
                className="acv-settings-header-btn"
                title="AI Settings"
              >
                <FiSettings className="acv-settings-icon-btn" />
                <span className="acv-github-text">Settings</span>
              </button>

              <a
                className="acv-github-link group"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                <FiGithub className="acv-github-icon" />
                <span className="acv-github-text">GitHub</span>
                <div className="acv-github-tooltip">View Source</div>
              </a>

              <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="acv-mobile-controls">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <button
              className="acv-menu-btn"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className={`acv-menu-icon ${open ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`acv-mobile-menu ${open ? "open" : ""}`}>
          <div className="acv-mobile-menu-content">
            <div className="acv-mobile-nav">
              <NavItem
                label="Home"
                active={current === "#/"}
                onClick={() => {
                  onNavigate?.("#/");
                  setOpen(false);
                }}
                mobile
              />
              <NavItem
                label="Generator"
                active={current === "#/generator"}
                onClick={() => {
                  onNavigate?.("#/generator");
                  setOpen(false);
                }}
                mobile
              />
              <NavItem
                label="API Docs"
                active={current === "#/api"}
                onClick={() => {
                  onNavigate?.("#/api");
                  setOpen(false);
                }}
                mobile
              />
              <a
                className="acv-mobile-link"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                <FiGithub size={20} />
                <span>GitHub Repository</span>
                <div className="acv-mobile-link-arrow">→</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle?: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="acv-theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="acv-toggle-track">
        <div className={`acv-toggle-thumb ${theme}`}>
          <FiSun className="acv-toggle-sun" />
          <FiMoon className="acv-toggle-moon" />
        </div>
      </div>
    </button>
  );
}

function NavItem({
  label,
  onClick,
  active,
  mobile,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`acv-mobile-nav-item ${active ? "active" : ""}`}
      >
        <span className="acv-mobile-nav-label">{label}</span>
        {active && <span className="acv-mobile-nav-indicator"></span>}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`acv-nav-item ${active ? "active" : ""}`}
    >
      <span className="acv-nav-label">{label}</span>
      <span className="acv-nav-underline"></span>
    </button>
  );
}
