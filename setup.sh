#!/bin/bash

echo "🚀 Setup Central de Notas PJ"
echo "=============================="

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p server/uploads
mkdir -p server/logs

# Set permissions
echo "🔐 Setting permissions..."
chmod 755 server/uploads
chmod 755 server/logs

# Copy environment file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp server/.env.example server/.env
    echo "⚠️  Please edit server/.env with your configuration!"
else
    echo "✅ .env file already exists"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "   docker-compose up -d"
echo ""
echo "📚 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
echo ""
echo "🌐 Services will be available at:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:3001"
echo "   - MongoDB:  mongodb://localhost:27017"
