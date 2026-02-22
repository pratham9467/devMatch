# DevMatch - Developer Connection Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
</p>

> Connect with developers who match your vibe. A Tinder-style swipe interface for developers to find connections based on skills and interests.

## Features

- **Swipe-based Discovery** - Intuitive card swiping to like or pass on developers
- **Skill Matching** - Connect with developers who have complementary or similar skills
- **Connection Requests** - Send likes and manage incoming connection requests
- **User Profiles** - View detailed profiles with skills, bio, and experience
- **Real-time Chat** - Chat with your connections (coming soon)
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JSON Web Token** - Authentication
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devmatch.git
cd devmatch
```

2. Install frontend dependencies:
```bash
cd devMatch
npm install
```

3. Install backend dependencies:
```bash
cd dev-tinder-backend
npm install
```

4. Configure environment variables:

Create a `.env` file in `dev-tinder-backend/`:
```env
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

5. Start the backend:
```bash
npm run dev
```

6. Start the frontend (in a new terminal):
```bash
cd devMatch
npm run dev
```

7. Open http://localhost:5173 in your browser

## Project Structure

```
devTinder/
├── devMatch/                 # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── dev-tinder-backend/       # Backend Express API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── middleware/       # Custom middleware
│   │   ├── model/           # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── app.js           # Express app
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

### User
- `GET /user/feed` - Get users to discover
- `GET /user/requests/received` - Get incoming connection requests
- `GET /user/connections` - Get accepted connections

### Connections
- `POST /request/send/like/:userId` - Send a like
- `POST /request/send/pass/:userId` - Pass on a user
- `POST /request/receive/accepted/:requestId` - Accept a connection
- `POST /request/receive/rejected/:requestId` - Reject a connection

### Profile
- `GET /profile/view` - Get current user profile
- `PATCH /profile/edit` - Update profile
- `POST /password/edit` - Change password

## Demo Accounts

Use these credentials for testing:
- Email: `fresh@test.com`
- Password: `Test@123`

## Security

- Passwords hashed with bcrypt
- JWT-based authentication
- HTTP-only cookies
- Rate limiting on auth endpoints
- CORS protection
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Screenshots

<div align="center">
  <img src="./screenshot.png" alt="DevMatch Login" width="300" />
  <img src="./screenshot.png" alt="DevMatch Discover" width="300" />
</div>

---

<p align="center">Made with ❤️ for developers</p>
