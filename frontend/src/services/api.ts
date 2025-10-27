export type GenerateRequest = {
  jobUrl?: string;
  jobDescription?: string;
  userMarkdown?: string;
  file?: File | null;
};

export async function generatePDF(req: GenerateRequest): Promise<Blob> {
  const form = new FormData();
  if (req.jobUrl && req.jobUrl.trim()) form.append("jobUrl", req.jobUrl.trim());
  if (req.jobDescription && req.jobDescription.trim())
    form.append("jobDescription", req.jobDescription.trim());
  if (req.userMarkdown && req.userMarkdown.trim())
    form.append("userMarkdown", req.userMarkdown.trim());
  if (req.file) form.append("file", req.file);

  const res = await fetch("/api/generate", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    let msg = `Failed to generate CV as PDF (${res.status} ${res.statusText})`;

    // Try to parse JSON error
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        const j = await res.json();

        // Handle FastAPI validation errors (422)
        if (j.detail) {
          if (typeof j.detail === "string") {
            msg = j.detail;
          } else if (Array.isArray(j.detail)) {
            // Format validation errors
            msg = j.detail
              .map((err: any) => `${err.loc?.join(".")}: ${err.msg}`)
              .join(", ");
          } else if (typeof j.detail === "object") {
            msg = JSON.stringify(j.detail);
          }
        } else if (j.error) {
          msg = j.error;
        }
      } catch {
        // Failed to parse JSON error response
      }
    } else {
      // Non-JSON response (HTML error page, etc.)
      try {
        const text = await res.text();
        // Extract error from HTML if possible
        const match = text.match(/<pre[^>]*>(.*?)<\/pre>/s);
        if (match) {
          msg = match[1].replace(/<[^>]*>/g, "").trim();
        }
      } catch {
        // Failed to read error response text
      }
    }

    throw new Error(msg);
  }
  return res.blob();
}
