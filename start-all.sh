#!/bin/bash
# Start both frontend and backend servers

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   OptimalCV - Starting All Services${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
  echo -e "${RED}Error: frontend or backend directory not found${NC}"
  echo -e "${RED}Please run this script from the project root${NC}"
  exit 1
fi

# Function to cleanup on exit
cleanup() {
  echo ""
  echo -e "${YELLOW}Stopping servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}Starting backend on port 8000...${NC}"
cd backend
./run.sh >../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 2

# Check if backend started
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo -e "${RED}❌ Backend failed to start${NC}"
  echo -e "${RED}Check backend.log for details${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Start frontend
echo -e "${BLUE}Starting frontend on port 5173...${NC}"
cd frontend
npm run dev >../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 2

# Check if frontend started
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
  echo -e "${RED}❌ Frontend failed to start${NC}"
  echo -e "${RED}Check frontend.log for details${NC}"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ All services running!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Frontend:     ${GREEN}http://localhost:5173${NC}"
echo -e "Backend API:  ${GREEN}http://localhost:8000/docs${NC}"
echo -e "Health Check: ${GREEN}http://localhost:8000/health${NC}"
echo ""
echo -e "Logs:"
echo -e "  Backend:  ${YELLOW}tail -f backend.log${NC}"
echo -e "  Frontend: ${YELLOW}tail -f frontend.log${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
