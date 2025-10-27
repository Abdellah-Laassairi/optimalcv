# PDF Generation Service

LaTeX-based PDF generation for AutoCV with direct LaTeX generation from LLM.

## Architecture

```
User Input → AI (OpenAI/OpenRouter) → LaTeX CV → pdflatex → PDF
```

### Pipeline Components

1. **retrieve-text** (`services/scraper.py`)
   - Scrapes job posting from URL
   - Extracts: title, company, location, description, requirements
   - Uses: `requests` + `BeautifulSoup`

2. **create-cv** (`services/generator.py`) ⭐ UPDATED
   - Generates tailored CV using configured AI provider
   - Outputs: **LaTeX format directly** (not markdown)
   - Fallback: Rule-based LaTeX generation if API unavailable
   - AI prompt instructs LLM to output complete LaTeX document

3. **latex-to-pdf** (`services/pdf_generator.py`)
   - Compiles LaTeX source to PDF
   - Uses: `pdflatex` (TeX Live)
   - Error handling and logging

## Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install LaTeX (Required for PDF generation)

**Ubuntu/Debian:**
```bash
chmod +x install_latex.sh
./install_latex.sh
```

**Manual installation:**
```bash
sudo apt-get update
sudo apt-get install -y texlive-latex-base texlive-fonts-recommended texlive-latex-extra
```

**Verify installation:**
```bash
pdflatex --version
```

### 3. Test PDF Generation

```bash
python test_pdf_generation.py
```

This will:
- Check LaTeX installation
- Generate `test_output.pdf` from sample LaTeX

## API Endpoints

### 1. Generate CV PDF ⭐ UPDATED

**POST** `/api/generate`

Generates CV as PDF file (LLM outputs LaTeX directly, then compiled to PDF).

**Request:**
```bash
curl -X POST http://localhost:8000/api/generate \
  -F "jobDescription=Senior Python Developer with FastAPI experience" \
  -F "userMarkdown=# John Doe\n## Experience\nSoftware Engineer with 5 years..." \
  --output cv.pdf
```

**Response:**
- Content-Type: `application/pdf`
- File download with generated PDF

**Parameters:**
- `jobUrl` (optional): URL to job posting
- `jobDescription` (optional): Job description text
- `userMarkdown` (optional): User's CV in markdown
- `file` (optional): Upload PDF/MD file with user's CV

---

### 2. Health Check Endpoints

**GET** `/health`
```bash
curl http://localhost:8000/health
```
```json
{"ok": true}
```

**GET** `/health/latex` ⭐ NEW
```bash
curl http://localhost:8000/health/latex
```
```json
{
  "installed": true,
  "version": "pdfTeX 3.141592653-2.6-1.40.24",
  "message": "LaTeX is properly installed"
}
```

## File Structure

```
backend/
├── app/
│   ├── main.py                          # FastAPI app with PDF endpoint
│   ├── resources/
│   │   └── cv-template.tex              # LaTeX template
│   └── services/
│       ├── scraper.py                   # Job URL scraping
│       ├── generator.py                 # LaTeX CV generation (direct from LLM) ⭐ UPDATED
│       ├── parsers.py                   # PDF/MD parsing
│       └── pdf_generator.py             # LaTeX → PDF
├── requirements.txt
├── install_latex.sh                     # LaTeX installation script ⭐ NEW
├── test_pdf_generation.py               # Test script ⭐ NEW
└── README_PDF.md                        # This file ⭐ NEW
```

## How It Works

### Direct LaTeX Generation

The LLM (via `generator.py`) generates LaTeX CV code directly:

**AI Prompt Instructions:**
- Use standard resume template with `\documentclass[letterpaper,11pt]{article}`
- Include required packages: latexsym, amsmath, fullpage, titlesec, etc.
- Create sections with `\section{}`: Professional Summary, Education, Experience, Projects, Skills
- Use `\resumeSubheading{}{}{}{}`for entries with 4 parameters
- Use `\resumeItem{}{}` for bullet points
- Tailor content with quantified impact and keywords from job description
- Ensure all special LaTeX characters are properly escaped
- Output complete LaTeX document from `\documentclass` to `\end{document}`

**Fallback Generation:**
- If API is unavailable, rule-based fallback generates basic LaTeX template
- Includes job requirements as skills and generic experience bullets
- Dates, locations, and titles extracted intelligently
- URLs converted to `\href` commands

### Compiling LaTeX to PDF

```python
import subprocess
import tempfile
import shutil


def compile_latex_to_pdf(latex_content: str) -> bytes:
    """
    Compiles a LaTeX string to a PDF file and returns its bytes.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        latex_file = f"{temp_dir}/cv.tex"
        with open(latex_file, "w") as f:
            f.write(latex_content)

        # Run pdflatex
        result = subprocess.run(
            [
                "pdflatex",
                "-interaction=nonstopmode",
                "-output-directory",
                temp_dir,
                latex_file,
            ],
            capture_output=True,
            text=True,
        )

        pdf_file = f"{temp_dir}/cv.pdf"
        if result.returncode == 0 and shutil.os.path.exists(pdf_file):
            with open(pdf_file, "rb") as f:
                return f.read()
        else:
            raise Exception(f"PDF generation failed: {result.stdout}")
```

**Error handling:**
- Timeout after 30 seconds
- Captures and logs LaTeX errors
- Returns helpful error messages
- Checks LaTeX installation before compilation

## Frontend Integration

Update the frontend to add PDF download option:

```typescript
// In services/api.ts
export async function generateCVPDF(req: GenerateRequest): Promise<Blob> {
  const formData = new FormData()

  if (req.jobUrl) formData.append('jobUrl', req.jobUrl)
  if (req.jobDescription) formData.append('jobDescription', req.jobDescription)
  if (req.userMarkdown) formData.append('userMarkdown', req.userMarkdown)
  if (req.file) formData.append('file', req.file)

  const response = await fetch(`${API_BASE}/api/generate-pdf`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to generate PDF')
  }

  return await response.blob()
}

// Usage in component
async function downloadPDF() {
  const pdfBlob = await generateCVPDF({ jobDescription, userMarkdown })
  const url = URL.createObjectURL(pdfBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-cv.pdf'
  a.click()
  URL.revokeObjectURL(url)
}
```

## Troubleshooting

### LaTeX not installed
```
PDFGenerationError: pdflatex not found
```
**Solution:** Run `./install_latex.sh`

### LaTeX compilation timeout
```
PDFGenerationError: LaTeX compilation timeout (>30s)
```
**Solution:** Check LaTeX source for infinite loops or very large documents

### LaTeX compilation error
```
PDFGenerationError: LaTeX compilation failed
```
**Solution:**
1. Check logs for specific LaTeX errors
2. Run `python test_pdf_generation.py` to inspect generated `.tex` file
3. Common issues: unescaped special characters, missing packages

### PDF not generated
```
PDFGenerationError: PDF file was not generated
```
**Solution:**
1. Check `test_output.log` for LaTeX errors
2. Verify template syntax is valid
3. Test with simple markdown first

## Performance

- **LaTeX generation**: ~2-5 seconds (LLM API)
- **PDF compilation**: ~1-2 seconds (pdflatex)
- **Total**: ~3-7 seconds end-to-end

## Security Considerations

1. **Temporary files**: All LaTeX compilation happens in temporary directories that are automatically cleaned up
2. **Input validation**: Special LaTeX characters are escaped
3. **Timeout protection**: 30-second compilation timeout prevents hanging
4. **Resource limits**: Consider adding Docker resource limits for production

## Production Deployment

### Docker

```dockerfile
FROM python:3.11-slim

# Install LaTeX
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
WORKDIR /app

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
OPENAI_API_KEY=sk-...        # For AI CV generation
OPENAI_MODEL=gpt-4o-mini     # Optional, defaults to gpt-4o-mini
```

## License

Same as main AutoCV project.
