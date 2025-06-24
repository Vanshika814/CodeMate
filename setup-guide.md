# DevTinder Clerk + MongoDB Setup Guide

## 🚀 Quick Start

### 1. Environment Variables
Create a `.env` file in your project root:

```env
# Database
DB_CONNECTION_STRING=mongodb://localhost:27017/devtinder
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/devtinder

# Clerk Keys (from https://dashboard.clerk.com)
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_for_backward_compatibility
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Test the Integration

#### Check if server is running:
```bash
curl http://localhost:3000/health
```

#### Test with Clerk authentication:
1. Get a Clerk session token from your frontend
2. Test protected endpoints:

```bash
# Check auth status (requires Clerk token in Authorization header)
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:3000/auth-status

# Auto-sync user
curl -X POST -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:3000/auto-sync

# Test integration
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:3000/test-integration
```

## 📋 API Endpoints

### Public Endpoints
- `GET /` - API documentation
- `GET /health` - Health check
- `POST /webhook/user` - Clerk webhook (for auto user sync)

### Authentication Endpoints  
- `GET /auth-status` - Check auth status
- `POST /auto-sync` - Auto-sync user from Clerk
- `POST /sync-user` - Manual user sync
- `GET /me` - Get current user
- `GET /test-integration` - Test endpoint

### Protected Endpoints (Require Clerk Auth)
- `GET /profile/view` - View profile
- `PATCH /profile/edit` - Edit profile
- `POST /request/send/:status/:toUserId` - Send connection request
- `POST /request/review/:status/:requestId` - Review request
- `GET /user/request/received` - Get received requests
- `GET /user/connections` - Get connections
- `GET /feed` - Get user feed

## 🔧 Frontend Integration

### React/Next.js Setup
1. Install Clerk:
```bash
npm install @clerk/nextjs
# or
npm install @clerk/clerk-react
```

2. Wrap your app with ClerkProvider:
```jsx
import { ClerkProvider } from '@clerk/nextjs'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}
```

3. Make authenticated API calls:
```jsx
import { useAuth } from '@clerk/nextjs'

function MyComponent() {
  const { getToken } = useAuth()
  
  const callAPI = async () => {
    const token = await getToken()
    const response = await fetch('http://localhost:3000/feed', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  }
}
```

## 🪝 Webhook Setup

1. In Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/webhook/user`
3. Select events: `user.created`, `user.updated`
4. Copy webhook secret to `.env`

## 🐛 Troubleshooting

### "User not found in database"
**Solution:** User exists in Clerk but not MongoDB
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/auto-sync
```

### CORS Errors
**Solution:** Update CORS origins in `src/app.js`

### Database Connection Issues
**Solution:** Check your `DB_CONNECTION_STRING` in `.env`

### Authentication Fails
**Solution:** 
1. Verify Clerk keys in `.env`
2. Check if user is properly signed in on frontend
3. Ensure Authorization header is included in requests

## 📊 Testing Flow

1. **Sign up** through Clerk on frontend
2. **Auto-sync** user data: `POST /auto-sync`
3. **View profile**: `GET /profile/view`
4. **Get feed**: `GET /feed`
5. **Send requests**: `POST /request/send/interested/:userId`
6. **View connections**: `GET /user/connections`

## 🎯 Key Features Working

✅ **Clerk Authentication** - Users sign in via Clerk
✅ **Auto User Sync** - Users automatically created in MongoDB
✅ **Protected Routes** - All APIs require authentication
✅ **Feed System** - View other users
✅ **Connection Requests** - Send/receive requests
✅ **Profile Management** - Edit user profiles
✅ **Real-time Sync** - Webhooks keep data in sync

Your DevTinder app is now fully integrated with Clerk + MongoDB! 🎉 