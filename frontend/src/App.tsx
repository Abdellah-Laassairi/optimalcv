import { useEffect, useState, useCallback, memo } from "react";
import Header from "./components/Header";
import Settings from "./components/Settings";
import PdfPreviewModal from "./components/PdfPreviewModal";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Api from "./pages/Api";

function App() {
  const [route, setRoute] = useState<string>(window.location.hash || "#/");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("acv-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // PDF state (shared between Generator and Modal)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("acv-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const onDownloadPDF = useCallback(() => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pdfBlob]);

  const isHome = route === "#/" || route === "";
  const isGenerator = route === "#/generator";
  const isAPI = route === "#/api";

  return (
    <div className="min-h-screen acv-app-bg">
      <Header
        onNavigate={(hash) => {
          window.location.hash = hash;
        }}
        active={route as any}
        theme={theme}
        onThemeToggle={toggleTheme}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <PdfPreviewModal
        isOpen={showPdfPreview}
        pdfUrl={pdfUrl}
        onClose={() => setShowPdfPreview(false)}
        onDownload={onDownloadPDF}
      />

      <main className="acv-container">
        {isHome && <Home />}

        {isGenerator && (
          <Generator
            pdfBlob={pdfBlob}
            setPdfBlob={setPdfBlob}
            pdfUrl={pdfUrl}
            setPdfUrl={setPdfUrl}
            showPdfPreview={showPdfPreview}
            setShowPdfPreview={setShowPdfPreview}
          />
        )}

        {isAPI && <Api />}
      </main>
    </div>
  );
}

export default memo(App);
