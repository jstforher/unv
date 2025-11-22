#!/bin/bash

# Her Beautiful Universe Setup Script
# This script sets up the entire development environment

set -e

echo "🌌 Setting up Her Beautiful Universe..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed ✓"

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_success "Created .env file ✓"
    print_warning "Please edit .env file with your specific settings"
else
    print_status ".env file already exists ✓"
fi

# Build and start services
print_status "Building and starting Docker services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check if database is ready
until docker-compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres; do
    print_status "Waiting for postgres..."
    sleep 2
done

print_success "Database is ready ✓"

# Run Django migrations
print_status "Running Django migrations..."
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py migrate

print_success "Migrations completed ✓"

# Load seed data
print_status "Loading seed data..."
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py load_seed_data

print_success "Seed data loaded ✓"

# Create superuser (optional)
echo ""
print_warning "Do you want to create a superuser for admin access? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    print_status "Creating superuser..."
    docker-compose -f docker-compose.dev.yml exec -T backend python manage.py createsuperuser
fi

# Show URLs
echo ""
print_success "🎉 Setup completed successfully!"
echo ""
echo "📱 Your Her Beautiful Universe is now running:"
echo ""
echo "Frontend (Next.js):     http://localhost:3000"
echo "Backend API:            http://localhost:8000/api"
echo "Django Admin:          http://localhost:8000/admin"
echo "Health Check:           http://localhost:8000/api/health"
echo ""
print_status "Default admin credentials (if created during setup):"
echo "Username: admin"
echo "Password: admin123"
echo ""
print_status "To stop the application, run:"
echo "docker-compose -f docker-compose.dev.yml down"
echo ""
print_status "To view logs, run:"
echo "docker-compose -f docker-compose.dev.yml logs -f"
echo ""
print_success "Enjoy exploring your beautiful universe! 💜"