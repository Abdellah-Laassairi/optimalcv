import { memo, useState, useCallback, useMemo, lazy, Suspense } from "react";
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import { generatePDF } from "../services/api";

// Lazy load components
const Uploader = lazy(() => import("../components/Uploader"));
const TextArea = lazy(() => import("../components/TextArea"));
const Input = lazy(() => import("../components/Input"));
const Button = lazy(() => import("../components/Button"));

interface GeneratorProps {
  pdfBlob: Blob | null;
  setPdfBlob: (blob: Blob | null) => void;
  pdfUrl: string | null;
  setPdfUrl: (url: string | null) => void;
  showPdfPreview: boolean;
  setShowPdfPreview: (show: boolean) => void;
}

const Generator = memo(
  ({
    pdfBlob,
    setPdfBlob,
    pdfUrl,
    setPdfUrl,
    showPdfPreview,
    setShowPdfPreview,
  }: GeneratorProps) => {
    const [jobUrl, setJobUrl] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [userMarkdown, setUserMarkdown] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showJobTextInput, setShowJobTextInput] = useState(false);
    const [showProfileTextInput, setShowProfileTextInput] = useState(false);

    const canSubmit = useMemo(() => {
      const hasJob =
        jobUrl.trim().length > 0 || jobDescription.trim().length > 0;
      const hasUser = userMarkdown.trim().length > 0 || file !== null;
      return hasJob && hasUser && !loadingPDF;
    }, [jobUrl, jobDescription, userMarkdown, file, loadingPDF]);

    const onGeneratePDF = useCallback(async () => {
      if (!canSubmit) return;
      setLoadingPDF(true);
      setError(null);
      try {
        const blob = await generatePDF({
          jobUrl: jobUrl.trim() || undefined,
          jobDescription: jobDescription.trim() || undefined,
          userMarkdown: userMarkdown.trim() || undefined,
          file: file || undefined,
        });
        setPdfBlob(blob);

        // Create object URL for preview
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowPdfPreview(true);
      } catch (e: any) {
        setError(e.message || "Failed to generate PDF");
        console.error(e);
      } finally {
        setLoadingPDF(false);
      }
    }, [
      canSubmit,
      jobUrl,
      jobDescription,
      userMarkdown,
      file,
      pdfUrl,
      setPdfBlob,
      setPdfUrl,
      setShowPdfPreview,
    ]);

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

    return (
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        }
      >
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pb-12 lg:pb-16">
          {/* Input Form Card */}
          <div className="lg:sticky lg:top-24">
            <Card className="overflow-hidden min-h-[700px] lg:min-h-[800px] flex flex-col">
              <div className="flex flex-col h-full">
                <div className="pb-6 border-b acv-border">
                  <h2 className="text-xl font-bold acv-text mb-2">
                    Input Details
                  </h2>
                  <p className="text-sm acv-text-muted leading-relaxed">
                    Provide job description and your profile information
                  </p>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto py-6">
                  {/* Job Input Section */}
                  <div className="space-y-4">
                    <Input
                      label="Job URL (Optional)"
                      type="url"
                      placeholder="https://company.com/jobs/senior-developer"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="w-full"
                    />

                    {!jobUrl.trim() && (
                      <div>
                        <button
                          onClick={() => setShowJobTextInput(!showJobTextInput)}
                          className="flex items-center gap-2 text-sm font-medium acv-text hover:acv-text-accent transition-colors"
                        >
                          {showJobTextInput ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                          {showJobTextInput ? "Hide" : "Enter"} Job Description
                          Manually
                        </button>

                        {showJobTextInput && (
                          <div className="mt-4">
                            <TextArea
                              label="Job Description"
                              value={jobDescription}
                              onChange={setJobDescription}
                              rows={6}
                              placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, and qualifications..."
                              showCount
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Input Section */}
                  <div className="space-y-4 pt-4 border-t acv-border">
                    <div>
                      <label className="block text-sm font-semibold acv-text mb-3">
                        Upload Your Profile (PDF/Markdown)
                      </label>
                      <Uploader onFileSelected={setFile} />
                      {file && (
                        <div className="acv-file-badge mt-4">
                          <FiFileText className="w-4 h-4" />
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>

                    {!file && (
                      <div>
                        <button
                          onClick={() =>
                            setShowProfileTextInput(!showProfileTextInput)
                          }
                          className="flex items-center gap-2 text-sm font-medium acv-text hover:acv-text-accent transition-colors"
                        >
                          {showProfileTextInput ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                          {showProfileTextInput ? "Hide" : "Enter"} Profile Text
                          Manually
                        </button>

                        {showProfileTextInput && (
                          <div className="mt-4">
                            <TextArea
                              label="Your Profile (Markdown)"
                              value={userMarkdown}
                              onChange={setUserMarkdown}
                              rows={8}
                              placeholder="# Your Name&#10;## Summary&#10;Experienced professional with...&#10;&#10;## Experience&#10;### Company Name | Position&#10;- Achievement 1&#10;- Achievement 2&#10;&#10;## Skills&#10;- Skill 1, Skill 2, Skill 3..."
                              showCount
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t acv-border space-y-4">
                  {error && (
                    <div className="acv-error-message">
                      <span className="font-semibold">⚠️ Error:</span> {error}
                    </div>
                  )}

                  <Button
                    disabled={!canSubmit}
                    onClick={onGeneratePDF}
                    iconLeft={<FiFileText />}
                    loading={loadingPDF}
                    loadingText="Generating your CV as PDF..."
                    className="w-full py-4 text-base font-semibold"
                  >
                    Generate CV as PDF
                  </Button>

                  {pdfBlob && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => setShowPdfPreview(true)}
                        iconLeft={<FiEye />}
                        variant="secondary"
                      >
                        Preview
                      </Button>
                      <Button
                        onClick={onDownloadPDF}
                        iconLeft={<FiDownload />}
                        variant="secondary"
                      >
                        Download
                      </Button>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <a
                      className="acv-link inline-flex items-center gap-2 text-xs"
                      href="/health"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiExternalLink className="w-3 h-3" />
                      Check API Status
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Card */}
          <Card className="min-h-[700px] lg:min-h-[800px]">
            {loadingPDF ? (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <Spinner className="!w-14 !h-14 mb-8" />
                <h3 className="text-xl font-semibold acv-text mb-3">
                  Generating Your CV
                </h3>
                <p className="acv-text-muted text-base leading-relaxed max-w-sm">
                  Our AI is crafting your professional, tailored CV...
                </p>
              </div>
            ) : pdfUrl ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 pb-5 border-b acv-border">
                  <div>
                    <h2 className="text-xl font-bold acv-text mb-1">
                      PDF Preview
                    </h2>
                    <p className="text-sm acv-text-muted">Your tailored CV</p>
                  </div>
                  <button
                    onClick={() => setShowPdfPreview(true)}
                    className="acv-preview-button"
                  >
                    <FiEye className="w-4 h-4" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </button>
                </div>
                <iframe
                  src={pdfUrl}
                  className="acv-pdf-preview"
                  style={{ minHeight: "650px" }}
                  title="CV Preview"
                />
              </div>
            ) : (
              <div className="acv-empty-state">
                <div className="acv-empty-icon-container">
                  <div className="acv-empty-glow"></div>
                  <div className="acv-empty-icon-wrapper">
                    <FiFileText className="acv-empty-icon" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold acv-text mb-3">
                  No CV Generated Yet
                </h3>
                <p className="acv-text-muted text-base leading-relaxed max-w-md px-4">
                  Fill in the job description and your profile, then click
                  <span className="acv-text-accent font-medium">
                    {" "}
                    "Generate CV as PDF"{" "}
                  </span>
                  to see your tailored resume.
                </p>
              </div>
            )}
          </Card>
        </section>
      </Suspense>
    );
  },
);

Generator.displayName = "Generator";

export default Generator;
