#!/bin/bash

# Video Recording Preparation Script
# This script helps you prepare for recording demo videos

echo "🎬 VIDEO RECORDING PREPARATION"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    echo "Run this script from the visualdatastructure root directory"
    exit 1
fi

echo "${BLUE}Step 1: Starting the frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}⚠️  node_modules not found. Running npm install...${NC}"
    npm install
fi

# Start the dev server in the background
echo "${BLUE}Starting development server...${NC}"
npm run dev &
DEV_SERVER_PID=$!

echo ""
echo "${GREEN}✓ Frontend server starting (PID: $DEV_SERVER_PID)${NC}"
echo ""

# Wait a few seconds for server to start
echo "⏳ Waiting for server to be ready..."
sleep 5

echo ""
echo "${GREEN}================================${NC}"
echo "${GREEN}✓ READY TO RECORD!${NC}"
echo "${GREEN}================================${NC}"
echo ""
echo "📱 Open your browser to: ${BLUE}http://localhost:5173${NC}"
echo ""
echo "${YELLOW}Recording Checklist:${NC}"
echo "  □ Browser in incognito/private mode"
echo "  □ Zoom set to 100%"
echo "  □ Bookmarks bar hidden (Cmd+Shift+B)"
echo "  □ Close unnecessary tabs"
echo "  □ Turn off notifications"
echo "  □ Start OBS or screen recording tool"
echo ""
echo "${YELLOW}Quick Video Ideas:${NC}"
echo "  1. Platform Overview (60s): Home → DP → Visualizations"
echo "  2. Stack Demo (30s): /stack → Push/Pop animations"
echo "  3. Two Pointers (45s): /two-pointers → Container problem"
echo "  4. ArrayList vs LinkedList (30s): /linkedlist → Comparisons"
echo "  5. Bit Manipulation (30s): /bit-manipulation → XOR tricks"
echo ""
echo "${BLUE}See VIDEO_SCRIPTS.md for detailed shot lists!${NC}"
echo ""
echo "Press Ctrl+C when done recording to stop the server"
echo ""

# Keep script running
wait $DEV_SERVER_PID
