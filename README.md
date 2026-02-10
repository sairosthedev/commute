# Commute Tracking Backend

TypeScript + Express backend for child commute tracking with MongoDB.

## Setup

1. Install dependencies:

   npm install

2. Configure environment:

   Copy .env.example to .env and update values.

   Set REDIS_ENABLED=false to run without Redis.

   Set EMAIL_ENABLED=true and SMTP_* values to send email alerts.

   Set FCM_ENABLED=true and FIREBASE_SERVICE_ACCOUNT_JSON to send push notifications.

3. Run the dev server:

   npm run dev

## Scripts

- npm run dev: Start development server
- npm run build: Build TypeScript
- npm run start: Run compiled server
- npm run lint: Run ESLint

## API (MVP)

- POST /api/auth/register
- POST /api/auth/login
- GET /api/children
- POST /api/children
- POST /api/locations
- GET /api/notifications
- POST /api/notifications/tokens
- DELETE /api/notifications/tokens
- POST /api/notifications/test-email
- GET /api/devices
- POST /api/devices
- POST /api/devices/:id/rotate
- POST /api/device/locations
- GET /api/trips?childId=&start=&end=&limit=

Device location ingest uses the header X-Device-Key.
