# Marvel Todo - Admin API

Admin API for sending notifications to Marvel Todo app users.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/admin-api)

1. Click the button above
2. Add environment variable: `ADMIN_API_KEY` (your secret key)
3. Upload `serviceAccountKey.json` in Vercel dashboard
4. Deploy!

## Local Setup

```bash
npm install
cp .env.example .env
# Add your ADMIN_API_KEY and place serviceAccountKey.json here
npm start
```

Open http://localhost:3000

## Environment Variables

- `ADMIN_API_KEY` - Your secret API key
- `PORT` - Server port (default: 3000)

## API Endpoints

- `GET /health` - Health check
- `POST /api/notifications/broadcast` - Send notification
- `GET /api/notifications` - Get all notifications
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/stats` - Get statistics

All endpoints (except `/health`) require `x-api-key` header.

## Usage

```bash
curl -X POST https://your-app.vercel.app/api/notifications/broadcast \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-key" \
  -d '{"title":"Test","message":"Hello!","type":"announcement"}'
```
