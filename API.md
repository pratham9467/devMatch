# DevTinder API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: Configure via `VITE_API_URL` environment variable

## Authentication
- Uses HTTP-only cookies for token storage
- All authenticated routes require the token cookie to be sent automatically

---

## Endpoints

### Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | No | Login with email/password |
| POST | `/signup` | No | Register new user |
| POST | `/logout` | Yes | Logout (clears cookie) |

#### POST /login
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "message": "Login successful",
  "data": {
    "_id": "user_id",
    "fname": "John",
    "email": "user@example.com"
  }
}
```

#### POST /signup
Request:
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "gender": "male",
  "age": 25,
  "skills": ["React", "TypeScript"],
  "profileUrl": "https://...",
  "about": "Developer bio"
}
```
Response:
```json
{
  "message": "Signup successful",
  "data": {
    "_id": "user_id",
    "fname": "John",
    "email": "user@example.com"
  }
}
```

---

### Profile Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/view` | Yes | Get current user profile |
| PATCH | `/profile/edit` | Yes | Update profile |
| POST | `/password/edit` | Yes | Change password |

#### GET /profile/view
Response:
```json
{
  "data": {
    "_id": "user_id",
    "fname": "John",
    "lname": "Doe",
    "email": "user@example.com",
    "gender": "male",
    "age": 25,
    "skills": ["React", "TypeScript"],
    "profileUrl": "https://...",
    "about": "Developer bio"
  }
}
```

#### PATCH /profile/edit
Request:
```json
{
  "fname": "John",
  "lname": "Doe",
  "profileUrl": "https://...",
  "skills": ["React", "TypeScript", "Node.js"],
  "about": "Updated bio",
  "age": 26
}
```
Response:
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### Connection/Request Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/request/send/like/:userId` | Yes | Send like to user |
| POST | `/request/send/pass/:userId` | Yes | Pass on user |
| POST | `/request/receive/accepted/:requestId` | Yes | Accept a request |
| POST | `/request/receive/rejected/:requestId` | Yes | Reject a request |

#### POST /request/send/like/:userId
Response:
```json
{
  "message": "Request sent successfully",
  "data": {
    "_id": "request_id",
    "fromUserId": "user_id",
    "toUserId": "target_user_id",
    "status": "like"
  }
}
```

---

### User Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/feed` | Yes | Get discovery feed |
| GET | `/user/requests/received` | Yes | Get received like requests |
| GET | `/user/connections` | Yes | Get accepted connections |

#### GET /user/feed
Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 20)

Response:
```json
{
  "data": [
    {
      "_id": "user_id",
      "fname": "Jane",
      "lname": "Doe",
      "profileUrl": "https://...",
      "skills": ["Python", "Django"],
      "age": 24,
      "gender": "female",
      "about": "Backend developer"
    }
  ]
}
```

#### GET /user/requests/received
Response:
```json
{
  "message": "Requests found",
  "data": [
    {
      "_id": "request_id",
      "fromUserId": {
        "_id": "user_id",
        "fname": "Jane",
        "lname": "Doe",
        "profileUrl": "https://...",
        "skills": ["Python"],
        "age": 24
      }
    }
  ]
}
```

#### GET /user/connections
Response:
```json
{
  "message": "Here are your connections",
  "data": [
    {
      "_id": "user_id",
      "fname": "Jane",
      "lname": "Doe",
      "profileUrl": "https://...",
      "skills": ["Python"],
      "age": 24
    }
  ]
}
```

---

## Frontend Integration

### API Service (`src/services/api.ts`)
```typescript
import { api, authService, profileService, connectionService, userService } from './services/api';

// Auth
await authService.login({ email, password });
await authService.signup({ fname, lname, email, password, skills });
await authService.logout();

// Profile
await profileService.getProfile();
await profileService.updateProfile({ fname, skills, about });
await profileService.updatePassword('newpassword');

// Connections
await connectionService.sendLike(userId);
await connectionService.sendPass(userId);
await connectionService.acceptRequest(requestId);
await connectionService.rejectRequest(requestId);

// Feed & Data
await userService.getFeed(page, limit);
await userService.getReceivedRequests();
await userService.getConnections();
```

### Auth Context (`src/context/AuthContext.tsx`)
```typescript
import { useAuth } from './context/AuthContext';

const { user, isAuthenticated, login, signup, logout, refreshUser } = useAuth();
```
