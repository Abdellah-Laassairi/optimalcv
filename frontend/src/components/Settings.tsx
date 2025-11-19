import { useState, useEffect } from "react";
import {
  FiX,
  FiSettings,
  FiSave,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiEdit3,
} from "react-icons/fi";
import Button from "./Button";
import Card from "./Card";
import "../settings.css";

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AISettings = {
  provider: string;
  model: string;
  api_key: string;
  temperature: number;
  max_tokens: number;
  api_key_set?: boolean;
};

type Provider = {
  id: string;
  name: string;
};

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<AISettings>({
    provider: "openrouter",
    model: "openai/gpt-4o-mini",
    api_key: "",
    temperature: 0.4,
    max_tokens: 4000,
  });
  const [models, setModels] = useState<Record<string, Provider[]>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState("");
  const [useCustomModel, setUseCustomModel] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      loadProviders();
    }
  }, [isOpen]);

  // Auto-detect if using a custom model
  useEffect(() => {
    const currentModels = models[settings.provider] || [];
    const isModelInList = currentModels.some((m) => m.id === settings.model);
    if (currentModels.length > 0 && !isModelInList) {
      setUseCustomModel(true);
    }
  }, [settings.provider, settings.model, models]);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadProviders() {
    try {
      const res = await fetch("/api/providers");
      if (res.ok) {
        const data = await res.json();
        setModels(data.models);
      }
    } catch (e) {
      console.error("Failed to load providers:", e);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("✓ Settings saved successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage("✗ Failed to save settings");
      }
    } catch (e) {
      setMessage("✗ Network error");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  const currentModels = models[settings.provider] || [];

  return (
    <div className="acv-settings-overlay">
      <div className="acv-settings-backdrop" onClick={onClose}></div>
      <Card className="acv-settings-modal">
        {/* Header */}
        <div className="acv-settings-header">
          <div className="flex items-center gap-3">
            <div className="acv-settings-icon-wrapper">
              <FiSettings className="acv-settings-icon" />
              <div className="acv-settings-icon-glow"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold acv-text">AI Settings</h2>
              <p className="text-sm acv-text-muted">
                Configure your AI provider
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="acv-settings-close"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="acv-settings-loading">
            <div className="acv-settings-spinner"></div>
            <p className="acv-text-muted">Loading settings...</p>
          </div>
        ) : (
          <div>
            {/* Provider Selection */}
            <div className="acv-settings-field">
              <label className="acv-settings-label">AI Provider</label>
              <select
                value={settings.provider}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    provider: e.target.value,
                    model: models[e.target.value]?.[0]?.id || settings.model,
                  });
                }}
                className="acv-settings-select"
              >
                <option value="openrouter">🌐 OpenRouter (Recommended)</option>
                <option value="openai">🤖 OpenAI</option>
                <option value="anthropic">🧠 Anthropic</option>
              </select>
              <p className="text-xs acv-text-muted mt-2">
                {settings.provider === "openrouter" && (
                  <>
                    OpenRouter provides access to multiple AI models.{" "}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="acv-settings-link inline-flex items-center gap-1"
                    >
                      Get API Key <FiExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
                {settings.provider === "openai" && (
                  <>
                    Direct access to OpenAI models.{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="acv-settings-link inline-flex items-center gap-1"
                    >
                      Get API Key <FiExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </p>
            </div>

            {/* Model Selection */}
            <div className="acv-settings-field">
              <div className="flex items-center justify-between mb-2">
                <label className="acv-settings-label">Model</label>
                <button
                  type="button"
                  onClick={() => setUseCustomModel(!useCustomModel)}
                  className="text-xs acv-settings-link inline-flex items-center gap-1.5 hover:underline"
                >
                  <FiEdit3 className="w-3 h-3" />
                  {useCustomModel ? "Use Preset" : "Custom Model"}
                </button>
              </div>

              {useCustomModel ? (
                <div>
                  <input
                    type="text"
                    value={settings.model}
                    onChange={(e) =>
                      setSettings({ ...settings, model: e.target.value })
                    }
                    placeholder="e.g., gpt-4o, claude-3-opus-20240229, or custom-model-name"
                    className="acv-settings-input"
                  />
                  <p className="text-xs acv-text-muted mt-2">
                    Enter any model name supported by your provider
                  </p>
                </div>
              ) : (
                <select
                  value={settings.model}
                  onChange={(e) =>
                    setSettings({ ...settings, model: e.target.value })
                  }
                  className="acv-settings-select"
                >
                  {currentModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* API Key */}
            <div className="acv-settings-field">
              <label className="acv-settings-label">
                API Key
                {settings.api_key_set && (
                  <span className="acv-settings-badge acv-badge-success">
                    ✓ Set
                  </span>
                )}
              </label>
              <div className="acv-settings-input-wrapper">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.api_key}
                  onChange={(e) =>
                    setSettings({ ...settings, api_key: e.target.value })
                  }
                  placeholder="sk-..."
                  className="acv-settings-input"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="acv-settings-eye-btn"
                >
                  {showApiKey ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Temperature */}
            <div className="acv-settings-field">
              <div className="flex items-center justify-between mb-2">
                <label className="acv-settings-label">Temperature</label>
                <span className="acv-settings-value">
                  {settings.temperature}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="acv-settings-slider"
              />
              <div className="flex justify-between text-xs acv-text-muted mt-1">
                <span>🎯 Focused</span>
                <span>🎨 Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="acv-settings-field">
              <label className="acv-settings-label">Max Tokens</label>
              <input
                type="number"
                value={settings.max_tokens}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    max_tokens: parseInt(e.target.value) || 4000,
                  })
                }
                min="500"
                max="8000"
                step="500"
                className="acv-settings-input"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`acv-settings-message ${message.startsWith("✓") ? "success" : "error"}`}
              >
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-3 mt-3 border-t acv-border">
              <Button
                onClick={handleSave}
                loading={saving}
                iconLeft={<FiSave />}
                className="flex-1"
              >
                Save Settings
              </Button>
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
