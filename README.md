# Her Beautiful Universe

A romantic 3D web app where your relationship memories float as interactive photo nodes in a magical universe. Built with Next.js, Three.js, Django, and lots of love 💜

## Features

- **3D Interactive Universe**: Explore memories in a beautiful 3D space
- **Memory Management**: Upload and organize photos, videos, and audio
- **Secret Messages**: Hidden memories waiting to be discovered
- **Admin Panel**: Secure dashboard for content management
- **Responsive Design**: Works beautifully on desktop and mobile
- **Romantic Theme**: Cosmic purples, soft pinks, and magical animations
- **Docker Deployment**: Production-ready containerization

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd her-beautiful-universe/unv
   ```

2. **Start development environment**
   ```bash
   # Copy environment file
   cp .env.example .env

   # Start all services
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Set up the database**
   ```bash
   # Run migrations
   docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

   # Load seed data
   docker-compose -f docker-compose.dev.yml exec backend python manage.py load_seed_data

   # Create superuser (optional)
   docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin

### Production Deployment

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

3. **Run initial setup**
   ```bash
   # Run migrations and load seed data
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py load_seed_data
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,yourdomain.com

# Database
DB_NAME=her_beautiful_universe
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_HOST=db
DB_PORT=5432

# Frontend
NEXT_PUBLIC_API_URL=http://yourdomain.com/api
```

## Usage

### Exploring the Universe

1. **Landing Page**: Beautiful romantic entrance to the experience
2. **3D Universe**: Click "Enter Universe" to explore memories in 3D space
3. **Memory Interaction**: Click on any floating memory node to view details
4. **Secret Discovery**: Find the hidden Heart Star to reveal secret messages
5. **Navigation**: Use the side menu to access different sections

### Admin Panel

1. **Login**: Access `/admin` and use your superuser credentials
2. **Manage Memories**: Add, edit, or delete memories
3. **Upload Media**: Add photos, videos, or audio files
4. **Settings**: Configure rotation speed, particles, and theme colors
5. **Secret Tokens**: Generate tokens for secret memory access

### API Endpoints

The REST API provides the following endpoints:

- `GET /api/memories/` - List memories (public)
- `POST /api/memories/` - Create memory (admin only)
- `GET /api/memories/{id}/` - Memory details
- `POST /api/memories/upload/` - Upload media (admin only)
- `GET /api/settings/` - Site settings
- `POST /api/auth/login/` - Admin authentication
- `POST /api/auth/logout/` - Admin logout
- `POST /api/memories/secret-reveal/` - Reveal secret memories

## Project Structure

```
unv/
├── backend/                 # Django backend
│   ├── project/            # Django project settings
│   ├── memories/           # Memories app
│   ├── users/              # Authentication app
│   ├── common/             # Shared utilities
│   ├── fixtures/           # Seed data
│   └── Dockerfile          # Production Dockerfile
├── src/
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   │   ├── universe/       # 3D scene components
│   │   ├── ui/             # UI components
│   │   └── admin/          # Admin components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── package.json            # Node dependencies
├── docker-compose.yml      # Production deployment
├── docker-compose.dev.yml  # Development environment
└── README.md              # This file
```

## Development

### Backend Development

```bash
# Enter backend container
docker-compose -f docker-compose.dev.yml exec backend bash

# Run management commands
python manage.py makemigrations
python manage.py migrate
python manage.py load_seed_data
python manage.py createsuperuser
```

### Frontend Development

```bash
# Enter frontend container
docker-compose -f docker-compose.dev.yml exec frontend sh

# Install new dependencies
npm install <package>

# Run tests
npm run test
```

### Database Management

```bash
# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d db
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Backup database
docker-compose -f docker-compose.dev.yml exec db pg_dump -U postgres her_beautiful_universe_dev > backup.sql
```

## Theme and Styling

The application uses a romantic cosmic theme with:

- **Primary Colors**: Deep space blue (#0b1020), Cosmic purple (#9b6cff)
- **Accent Colors**: Soft pink (#ff6b8a), Star white (#f6f7ff)
- **Typography**: Poppins (display), Inter (body)
- **Animations**: Gentle floating, pulsing, and sparkle effects

### Custom CSS Classes

- `.glass` - Glass morphism effect
- `.romantic-btn` - Animated gradient button
- `.text-gradient` - Gradient text effect
- `.float-animation` - Gentle floating animation
- `.gentle-pulse` - Soft pulsing effect

## Performance

The application includes several performance optimizations:

- **Progressive Loading**: Load memories as needed
- **LOD System**: Adjust quality based on device capabilities
- **Image Optimization**: Responsive images with lazy loading
- **3D Performance**: Auto-adjust particle effects and node count
- **Caching**: Redis for frequently accessed data

## Security

- **Admin Authentication**: Token-based admin access
- **File Validation**: Media type and size restrictions
- **CORS Protection**: Configured for production domains
- **Secret Memories**: Protected by one-time tokens
- **Rate Limiting**: Prevent abuse of upload endpoints

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if database is running
   docker-compose ps

   # Restart database service
   docker-compose restart db
   ```

2. **Frontend Build Error**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   docker-compose -f docker-compose.dev.yml up --build frontend
   ```

3. **Static Files Not Loading**
   ```bash
   # Collect static files
   docker-compose exec backend python manage.py collectstatic --noinput
   ```

4. **Memory Upload Fails**
   ```bash
   # Check file permissions
   docker-compose exec backend ls -la media/

   # Ensure media directory exists
   docker-compose exec backend mkdir -p media/memories
   ```

### Logs

```bash
# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# View database logs
docker-compose logs db
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.

---

Made with 💜 for celebrating beautiful relationships.
