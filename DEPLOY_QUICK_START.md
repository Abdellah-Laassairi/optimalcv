# 🚀 Quick Deploy Guide

Get OptimalCV up and running in minutes!

## Option 1: Full Stack on Render (Easiest)

Deploy everything to Render in one go.

### Steps:

1. **Push to GitHub** (if not already done)
2. **Go to [Render.com](https://render.com)**
3. **Create New Web Service**:
   - Connect your GitHub repository
   - Use Docker Compose
   - Render will read `docker-compose.yml`
4. **Set environment variables** (see [env.example](./env.example))
5. **Deploy** 🎉

Access at: `https://your-project.onrender.com`

## Option 2: Frontend on Vercel + Backend on Render (Fastest)

Get the fastest frontend with CDN, backend stays on Render.

### Backend (5 minutes):

1. Deploy to Render:
   - Use `backend/Dockerfile.render`
   - Start command: `cd optimalcv && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (2 minutes):

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set backend URL
vercel env add VITE_API_URL
# Enter: https://your-backend.onrender.com
```

Done! ✅

## Option 3: Docker (Local Testing)

```bash
docker-compose up -d
```

Access at: `http://localhost:3000`

---

## 📚 Detailed Guides

- **[Render Full Stack Deploy](https://render.com/docs/docker-compose)** - Deploy everything to Render
- **[Vercel + Render Hybrid](VERCEL_DEPLOYMENT.md)** - Frontend on Vercel, backend on Render
- **[Backend Only](backend/README.md)** - Deploy just the API
- **[Frontend Only](frontend/README.md)** - Deploy just the UI

## 🆘 Need Help?

- Check [Troubleshooting](VERCEL_DEPLOYMENT.md#-troubleshooting)
- View [Full Documentation](https://abdellah.github.io/optimalcv)
- Open an [Issue](https://github.com/abdellah/optimalcv/issues)
