#!/bin/bash

# TrustMeds Setup Script
# Automated setup for development environment

echo "🚀 TrustMeds Setup Script"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "\n${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo "Download from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check MongoDB
echo -e "\n${YELLOW}Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB found${NC}"
elif command -v mongo &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB found${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "Options:"
    echo "  1. Install MongoDB: https://www.mongodb.com/try/download/community"
    echo "  2. Use MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Setup Backend
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env${NC}"
    echo -e "${YELLOW}⚠️  Edit backend/.env with your MongoDB URI${NC}"
else
    echo -e "${GREEN}✅ .env exists${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

# Seed database
read -p "Seed database with sample medicines? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed
    echo -e "${GREEN}✅ Database seeded${NC}"
fi

cd ..

# Setup Frontend
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd frontend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env${NC}"
else
    echo -e "${GREEN}✅ .env exists${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

cd ..

# Summary
echo -e "\n${GREEN}════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo ""
echo "1. Start Backend (Terminal 1):"
echo -e "   ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo -e "   ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo "3. Open browser:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "4. Test API:"
echo -e "   ${YELLOW}curl http://localhost:5000/api/health${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
