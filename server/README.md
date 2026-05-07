# Backend Setup Guide

## Environment Variables

1. Copy `.env.example` to `.env` at the root of the project
2. Get your Neon database URL from [https://console.neon.tech/](https://console.neon.tech/)
3. Update the `DATABASE_URL` in your `.env` file

Example:
```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/dbname?sslmode=require
PORT=5000
NODE_ENV=development
```

## Installation

```bash
# Install dependencies
npm install

# Initialize Prisma and push schema to database
npx prisma migrate dev --name init

# Or just push schema without migration history
npx prisma db push
```

## Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm run start
```

## Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create migration
npx prisma migrate dev --name <name>

# View database in studio
npx prisma studio
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/messages` - Create a contact message
- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get single message
- `PATCH /api/messages/:id/read` - Mark message as read
- `DELETE /api/messages/:id` - Delete message

## Example Request

```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service": "Web Development",
    "budget": "$5000-$10000",
    "message": "I would like to discuss a project..."
  }'
```
