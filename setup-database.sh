#!/bin/bash

# 🚀 Database Setup Script for Deployment
set -e

echo "🔄 Setting up database for deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set your PostgreSQL connection string:"
    echo "export DATABASE_URL='postgresql://user:password@host:port/database'"
    exit 1
fi

# Check if drizzle-kit is installed
if ! command -v drizzle-kit &> /dev/null; then
    echo "📦 Installing drizzle-kit..."
    npm install -g drizzle-kit
fi

# Generate and run migrations
echo "🔄 Generating database migrations..."
npx drizzle-kit generate

echo "🔄 Pushing schema to database..."
npx drizzle-kit push

echo "✅ Database setup completed!"
echo "📝 Your database is now ready for deployment"
