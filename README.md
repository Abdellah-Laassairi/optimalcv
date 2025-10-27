# OptimalCV - AI-Powered CV Generator

<div align="center">

![OptimalCV Logo](frontend/src/assets/OptimalCVLogo.svg)

**Generate ATS-optimized, professional CVs tailored to any job posting using AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-19.1.1-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)](https://fastapi.tiangolo.com/)
[![Deploy to Render](https://img.shields.io/badge/Deploy%20to-Render-46E3B7?logo=render&logoColor=white)](https://render.com/deploy)

[Features](#features) • [Deploy FREE](#-deploy-free-on-rendercom) • [Installation](#installation) • [Usage](#usage) • [API](#api)

---

### 🚀 Deploy FREE on Render.com

Get your OptimalCV instance running in minutes on Render's free tier!

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**[📖 Render Deployment Guide](docs/deployment/render-detailed.md)** | **[💰 $0/month on free tier!](docs/deployment/render-detailed.md#-cost-optimization)**  
**[🚀 Vercel Deployment](VERCEL_DEPLOYMENT.md)** | **[Deploy Frontend to Vercel + Backend to Render](VERCEL_DEPLOYMENT.md)**

</div>

---

## 🌟 Features

### 🎯 **Smart CV Generation**
- **Multi-Stage AI Processing**: Uses chain-of-thought reasoning with 3 AI stages for optimal results
  - **Stage 1**: Content generation focused on relevance and impact
  - **Stage 2**: HR professional review for conciseness and best practices  
  - **Stage 3**: Final verification and LaTeX compilation
- **Job-Tailored Content**: Automatically matches your experience to job requirements
- **ATS Optimization**: Keyword optimization for Applicant Tracking Systems
- **STAR Method**: Achievement-focused bullet points with quantified results

### 🤖 **Flexible AI Providers**
- OpenAI (GPT-4, GPT-4o, GPT-4o-mini)
- OpenRouter (Access to multiple models)
- Anthropic (Claude models)
- Custom model names support

### 📄 **Professional LaTeX Output**
- Clean, professional formatting
- Customizable templates
- Automatic special character escaping
- PDF generation with error handling

### 🌐 **Modern Web Interface**
- React 19 with TypeScript
- Beautiful, responsive UI with Tailwind CSS v4
- Real-time PDF preview
- Dark/Light theme support
- Drag-and-drop file uploads

### 🔧 **Developer Friendly**
- RESTful API with OpenAPI documentation
- Pip-installable Python package
- Docker support
- Comprehensive configuration options
- One-click deploy to Render or Vercel

---

## 📦 Installation

### Option 1: Pip Install (Backend Only)

```bash
pip install optimalcv
```

### Option 2: From Source (Full Stack)

#### Prerequisites
- Python 3.9+
- Node.js 20.19+ or 22.12+ (for frontend)
- LaTeX distribution (TeX Live or MiKTeX)

#### Clone Repository
```bash
git clone https://github.com/abdellah/optimalcv.git
cd optimalcv
```

#### Backend Setup
```bash
cd backend
pip install -e .  # Install in development mode
# Or: pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run build
```

#### LaTeX Installation
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y texlive-latex-base texlive-fonts-recommended \
    texlive-fonts-extra texlive-latex-extra

# macOS
brew install --cask mactex

# Windows
# Download and install MiKTeX from https://miktex.org/download
```

### Option 3: Docker (Recommended)

```bash
docker-compose up -d
```

Access the application at `http://localhost:3000`

---

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the convenience script:
```bash
./backend/run.sh
```

### 2. Start Frontend (Development)

```bash
cd frontend
npm run dev
```

### 3. Configure AI Provider

- Open the application at `http://localhost:5173` (development) or `http://localhost:3000` (production)
- Click the **Settings** icon in the header
- Select your AI provider (OpenAI, OpenRouter, or Anthropic)
- Enter your API key
- Choose your preferred model
- Save settings

### 4. Setup Pre-commit Hooks (Optional but Recommended)

```bash
# Install pre-commit
pip install pre-commit

# Setup hooks
pre-commit install

# Run on all files
pre-commit run --all-files
```

**📖 [Pre-commit Guide](docs/development/pre-commit-guide.md)** - Automatic code quality checks

### 5. Generate Your CV

1. **Provide Job Information**:
   - Paste a job URL (LinkedIn, Indeed, etc.)
   - Or manually enter job description

2. **Upload Your Profile**:
   - Upload existing CV (PDF)
   - Or paste markdown/text of your background

3. **Click Generate**: Watch the AI create a tailored CV through 3 optimization stages

4. **Download**: Get your professional PDF CV

---

## 🔌 API Usage

### Install as Library

```python
from optimalcv import generate_cv_latex, generate_cv_pdf
from optimalcv.services.scraper import JobInfo

# Create job info
job = JobInfo(
    title="Software Engineer",
    company="Tech Corp",
    description="Looking for a skilled developer...",
    requirements=["Python", "FastAPI", "React"],
)

# Generate LaTeX CV
latex_cv = generate_cv_latex(
    user_description="Your professional background...", job=job
)

# Generate PDF
pdf_bytes = generate_cv_pdf(latex_cv)

with open("my_cv.pdf", "wb") as f:
    f.write(pdf_bytes)
```

### REST API

Full API documentation available at `http://localhost:8000/docs`

#### Generate CV
```bash
curl -X POST "http://localhost:8000/api/generate" \
  -F "job_url=https://linkedin.com/jobs/..." \
  -F "profile_file=@resume.pdf"
```

#### Configure Settings
```bash
curl -X POST "http://localhost:8000/api/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "api_key": "sk-...", # pragma: allowlist secret
    "temperature": 0.4,
    "max_tokens": 4000
  }'
```

---

## 🏗️ Architecture

```
optimalcv/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── main.py      # API endpoints
│   │   ├── services/    # Core business logic
│   │   │   ├── generator.py    # CV generation with chain-of-thought
│   │   │   ├── scraper.py      # Job URL scraping
│   │   │   ├── parsers.py      # PDF/document parsing
│   │   │   ├── pdf_generator.py # LaTeX to PDF compilation
│   │   │   └── settings.py     # Configuration management
│   │   └── resources/   # Templates and prompts
│   ├── pyproject.toml   # Pip package configuration
│   └── requirements.txt
├── frontend/            # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── services/    # API client
│   └── package.json
├── .github/             # CI/CD workflows
└── docker-compose.yml   # Docker orchestration
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# AI Provider Settings
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...

# Server Settings
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional: Custom AI Base URL
AI_BASE_URL=https://api.openai.com/v1
```

### Custom LaTeX Templates

Edit `backend/app/resources/template.tex` to customize CV layout and styling.

### Prompt Engineering

Modify prompts in `backend/app/resources/prompts.yaml` to adjust AI behavior:
- `cv_content_generation_prompt`: Initial content generation
- `cv_hr_review_prompt`: HR review and refinement
- `cv_system_prompt`: Final LaTeX generation

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Integration tests
docker-compose -f docker-compose.test.yml up
```

---

## 📚 Documentation

- **[📖 Full Documentation](https://abdellah.github.io/optimalcv)** - Complete user guide
- **[🔌 API Docs](http://localhost:8000/docs)** - Interactive OpenAPI documentation
- **[🤝 Contributing](docs/development/contributing-guide.md)** - Help improve OptimalCV
- **[📝 Changelog](docs/changelog.md)** - Version history
- **[❓ FAQ](docs/faq.md)** - Common questions
- **[🚀 Deployment](docs/deployment/deployment-guide.md)** - Deployment guides
- **[🎯 Setup Complete](docs/getting-started/setup-complete.md)** - Setup checklist

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/development/contributing-guide.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test` and `pytest`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- **Python**: Follow PEP 8, use `black` for formatting
- **TypeScript**: Follow Airbnb style guide, use `prettier`
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [OpenAI](https://openai.com/) - AI models
- [LaTeX](https://www.latex-project.org/) - Document preparation system

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/abdellah/optimalcv/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abdellah/optimalcv/discussions)
- **Email**: support@optimalcv.app

---

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] More CV templates
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Interview preparation tips
- [ ] Batch CV generation
- [ ] Chrome extension
- [ ] Mobile app

---

<div align="center">

Made with ❤️ by the OptimalCV Team

**[⬆ back to top](#optimalcv---ai-powered-cv-generator)**

</div>
