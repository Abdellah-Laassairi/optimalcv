# AutoCV Backend

Backend API for AutoCV - AI-powered CV generation with multi-stage optimization.

## 📦 Installation

### As a Python Package

```bash
# Install from PyPI
pip install autocv

# Or install from source
git clone https://github.com/yourusername/autocv.git
cd autocv/backend
pip install -e .
```

### Development Installation

```bash
# Install with development dependencies
pip install -e ".[dev]"

# Or using hatch
pip install hatch
hatch env create
hatch shell
```

## 🚀 Quick Start

### Using as a Library

```python
from autocv import generate_cv_latex, generate_cv_pdf, scrape_job_url, JobInfo

# Scrape a job posting
job = scrape_job_url("https://linkedin.com/jobs/...")

# Or create job info manually
job = JobInfo(
    title="Software Engineer",
    company="Tech Corp",
    description="We are looking for...",
    requirements=["Python", "FastAPI", "React"],
)

# Generate CV LaTeX
latex_content = generate_cv_latex(
    user_description="Your professional background here...", job=job
)

# Generate PDF
pdf_bytes = generate_cv_pdf(latex_content)

# Save to file
with open("cv.pdf", "wb") as f:
    f.write(pdf_bytes)
```

### Running the API Server

```bash
# Run with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the command (after pip install)
autocv-server

# API documentation available at:
# http://localhost:8000/docs
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# AI Provider (openai, openrouter, or anthropic)
AI_PROVIDER=openai

# Model name
AI_MODEL=gpt-4o-mini

# API Keys
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY

# Optional: Custom base URL
AI_BASE_URL=https://api.openai.com/v1

# Server settings
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Programmatic Configuration

```python
from autocv.services.settings import update_settings

update_settings(
    provider="openai",
    model="gpt-4o-mini",
    api_key="YOUR_API_KEY",
    temperature=0.4,
    max_tokens=4000,
)
```

## 📚 API Endpoints

### Generate CV

```http
POST /api/generate
Content-Type: multipart/form-data

job_url: string (or job_text)
profile_file: file (or profile_text)
```

### Update Settings

```http
POST /api/settings
Content-Type: application/json

{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "api_key": "YOUR_API_KEY",
  "temperature": 0.4,
  "max_tokens": 4000
}
```

### Get Settings

```http
GET /api/settings
```

### Health Check

```http
GET /health
```

## 🧪 Development

### Using Hatch

```bash
# Run tests
hatch run test

# Run tests with coverage
hatch run test-cov

# Lint code
hatch run lint

# Format code
hatch run format

# Type check
hatch run type-check

# Run all checks
hatch run all
```

### Manual Commands

```bash
# Install dependencies
pip install -e ".[dev]"

# Run tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Lint
flake8 app

# Format
black app
isort app

# Type check
mypy app --ignore-missing-imports
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Package initialization & exports
│   ├── main.py              # FastAPI application & endpoints
│   ├── services/            # Core business logic
│   │   ├── generator.py     # CV generation with multi-stage AI
│   │   ├── scraper.py       # Job posting scraper
│   │   ├── parsers.py       # PDF/document parsing
│   │   ├── pdf_generator.py # LaTeX to PDF compilation
│   │   └── settings.py      # Configuration management
│   └── resources/           # Templates & prompts
│       ├── prompts.yaml     # AI prompts for each stage
│       └── template.tex     # LaTeX template
├── pyproject.toml           # Package configuration (hatchling)
├── requirements.txt         # Dependencies
├── Dockerfile              # Docker image
└── README.md              # This file
```

## 🎯 Features

### Multi-Stage CV Generation

The backend uses a sophisticated chain-of-thought approach:

1. **Content Generation Stage**: AI focuses on relevance and impact
2. **HR Review Stage**: Professional review for conciseness
3. **Final Verification**: LaTeX generation and error checking

### AI Provider Support

- OpenAI (GPT-4, GPT-4o, GPT-4o-mini)
- OpenRouter (Multi-model access)
- Anthropic (Claude models)
- Custom models with flexible naming

### Smart Features

- Automatic special character escaping
- LaTeX symbol fixing
- Job URL scraping (LinkedIn, Indeed, etc.)
- PDF/document parsing
- Structured output with Pydantic
- Comprehensive error handling

## 🔐 Security

- API keys are stored securely
- Input validation on all endpoints
- CORS protection
- No sensitive data in logs
- Secure file handling

## 📖 Documentation

- [Full API Documentation](http://localhost:8000/docs)
- [Main Project README](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)

## 🐛 Known Issues

- LaTeX compilation requires TeX Live installation
- Some job sites may require authentication for scraping
- Large PDFs may take time to process

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

## 🙏 Credits

Built with:
- [FastAPI](https://fastapi.tiangolo.com/)
- [Pydantic](https://pydantic.dev/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)
- [PyPDF](https://pypdf.readthedocs.io/)
- [Loguru](https://loguru.readthedocs.io/)
