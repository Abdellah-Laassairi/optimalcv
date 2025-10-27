import { memo } from "react";
import { FiSend, FiExternalLink } from "react-icons/fi";
import Card from "../components/Card";

const Api = memo(() => {
  const baseUrl = window.location.origin;

  return (
    <section className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">
            API
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Documentation
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Integrate OptimalCV's AI-powered CV generation into your applications
        </p>
      </div>

      {/* Getting Started */}
      <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Getting Started</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          The OptimalCV API allows you to generate tailored CVs
          programmatically. All requests are made to the base URL and require
          proper authentication.
        </p>
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              Base URL
            </span>
          </div>
          <code className="block text-sm md:text-base text-gray-300 font-mono break-all">
            {baseUrl}/api
          </code>
        </div>
      </Card>

      {/* Generate CV Endpoint */}
      <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6">
          Generate CV as PDF
        </h2>

        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
            POST
          </span>
          <code className="text-sm text-gray-300 font-mono">/generate</code>
        </div>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Generate a tailored CV as a professional PDF based on a job
          description and user profile. The CV is generated using AI, converted
          to LaTeX, and compiled to PDF.
        </p>

        {/* Request Body */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Request Body
            <span className="ml-3 text-sm font-normal text-gray-400">
              (multipart/form-data)
            </span>
          </h3>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5 mb-6">
            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
              <code>{`FormData fields:
  jobUrl: string (optional)
  jobDescription: string (optional)
  userMarkdown: string (optional)
  file: File (optional)`}</code>
            </pre>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "jobUrl",
                desc: "URL to the job posting (optional if jobDescription provided)",
              },
              {
                name: "jobDescription",
                desc: "Raw job description text (optional if jobUrl provided)",
              },
              {
                name: "userMarkdown",
                desc: "User profile in Markdown format (optional if file provided)",
              },
              {
                name: "file",
                desc: "PDF or Markdown file with user profile (optional if userMarkdown provided)",
              },
            ].map((param, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/5"
              >
                <code className="text-sm font-semibold text-indigo-400 flex-shrink-0">
                  {param.name}
                </code>
                <span className="text-sm text-gray-400">{param.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Response</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5">
            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
              <code>{`Content-Type: application/pdf
Content-Disposition: attachment; filename=cv_[job_title].pdf

[Binary PDF content]`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Example Request */}
      <Card className="mb-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">Example Request</h2>

        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              cURL
            </span>
          </div>
          <pre className="text-xs md:text-sm text-gray-300 font-mono overflow-x-auto">
            <code>{`curl -X POST ${baseUrl}/api/generate \\
  -F "jobDescription=Senior React Developer with 5+ years..." \\
  -F "userMarkdown=# John Doe\\n## Experience..." \\
  -o cv_output.pdf`}</code>
          </pre>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          💡 The response will be a PDF file that can be saved directly with the{" "}
          <code className="text-indigo-400 px-1.5 py-0.5 bg-indigo-500/10 rounded">
            -o
          </code>{" "}
          flag.
        </p>
      </Card>

      {/* Health Check Endpoints */}
      <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6">
          Health Check Endpoints
        </h2>

        <div className="space-y-8">
          {/* /health */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-bold uppercase">
                GET
              </span>
              <code className="text-sm text-gray-300 font-mono">/health</code>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Check if the API is running and healthy.
            </p>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5">
              <pre className="text-sm text-gray-300 font-mono">
                <code>{`{
  "ok": true
}`}</code>
              </pre>
            </div>
          </div>

          {/* /health/latex */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-bold uppercase">
                GET
              </span>
              <code className="text-sm text-gray-300 font-mono">
                /health/latex
              </code>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Check LaTeX installation status (required for PDF generation).
            </p>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5">
              <pre className="text-sm text-gray-300 font-mono">
                <code>{`{
  "installed": true,
  "version": "pdfTeX 3.14159265...",
  "message": "LaTeX is properly installed"
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Responses */}
      <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6">Error Responses</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The API returns standard HTTP status codes. Error responses include a
          message field with details.
        </p>

        <div className="space-y-6">
          {[
            {
              code: "400",
              title: "Bad Request",
              desc: "Missing required parameters or invalid input",
              color: "rose",
            },
            {
              code: "500",
              title: "Internal Server Error",
              desc: "Something went wrong on the server",
              color: "red",
            },
          ].map((error, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1.5 rounded-lg bg-${error.color}-500/20 text-${error.color}-400 text-xs font-bold`}
                >
                  {error.code}
                </span>
                <span className="font-semibold text-white">{error.title}</span>
              </div>
              <p className="text-sm text-gray-400 ml-16">{error.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Need Help Section */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20 backdrop-blur-sm">
        <div className="flex items-start gap-6 p-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <FiSend className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">Need Help?</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Have questions about the API? Check out our GitHub repository or
              reach out to our community.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              <FiExternalLink className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
});

Api.displayName = "Api";

export default Api;
