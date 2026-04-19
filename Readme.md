<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

# BroBalance

> A student-focused money management app to track money lent between friends — never forget who owes you again.

### [Live Demo → brobalance.vercel.app](https://brobalance.vercel.app/)

Students frequently lend small amounts for food, travel, events, and shared expenses but often lose track. BroBalance provides a clean, intuitive platform to record transactions, manage friendships, send reminders, and stay on top of balances.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Routes](#frontend-routes)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Authentication** — Email/password registration & login with JWT, plus Google OAuth 2.0
- **Friend Management** — Send, accept, decline friend requests; remove friends
- **Transaction Tracking** — Record money lent/borrowed between friends with running balances
- **Dashboard** — At-a-glance stats: total friends, money to receive, money to pay
- **Notifications** — In-app notifications for friend requests, accepted requests, and transactions
- **Reminders** — Nudge friends about pending repayments *(planned)*
- **Newsletter** — Email subscription for platform updates
- **Responsive UI** — Mobile-first design with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7 (SSR), Vite 7, Tailwind CSS 4, TypeScript |
| **Backend** | Node.js, Express 5, TypeScript, Mongoose 9 |
| **Database** | MongoDB |
| **Auth** | JWT + Passport.js (Google OAuth 2.0) |
| **Validation** | express-validator |
| **Email** | EmailJS (client-side contact form) |
| **DevTools** | Nodemon, tsx, ESLint |

---

## Project Structure

```
BroBalance/
├── Backend/
│   ├── src/
│   │   ├── server.ts              # Entry point
│   │   ├── config/
│   │   │   ├── db.ts              # MongoDB connection
│   │   │   └── env.ts             # Environment variables
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   ├── error.middleware.ts # Global error handler
│   │   │   └── validate.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/              # Register, login, Google OAuth
│   │   │   ├── user/              # Profile management
│   │   │   ├── friend/            # Friend requests & balances
│   │   │   ├── transaction/       # Money tracking
│   │   │   ├── notification/      # In-app notifications
│   │   │   ├── newsletter/        # Email subscriptions
│   │   │   └── reminder/          # Payment reminders
│   │   ├── routes/
│   │   │   └── index.ts           # Central route registry
│   │   ├── utils/
│   │   │   ├── AppError.ts        # Custom error class
│   │   │   ├── jwt.ts             # Token helpers
│   │   │   ├── passport.ts        # Google OAuth strategy
│   │   │   ├── logger.ts          # Logging utility
│   │   │   └── response.ts        # Response helpers
│   │   └── types/
│   │       └── express.d.ts       # Express type augmentation
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── app/
│   │   ├── root.tsx               # App shell
│   │   ├── routes.ts              # Route definitions
│   │   └── routes/                # Page components
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   └── pages/                 # Page-level components
│   ├── public/                    # Static assets
│   ├── Dockerfile                 # Production Docker image
│   ├── package.json
│   └── vite.config.ts
│
└── DiagramsMd/                    # Architecture diagrams
    ├── classDiagram.md
    ├── ErDiagram.md
    ├── sequenceDiagram.md
    └── useCaseDiagram.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **MongoDB** (local instance or MongoDB Atlas)
- **Google OAuth credentials** (optional, for social login)

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/brobalance
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `8000` | Server port |
| `MONGODB_URI` | **Yes** | `mongodb://localhost:27017/brobalance` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWTs |
| `SESSION_SECRET` | **Yes** | — | Express session secret |
| `GOOGLE_CLIENT_ID` | No | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | — | Google OAuth client secret |
| `NODE_ENV` | No | `development` | `development` or `production` |

---

## API Reference

Base URL: `/api`

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register with email & password |
| `POST` | `/login` | No | Login with credentials |
| `POST` | `/logout` | Yes | Logout (invalidate session) |
| `GET` | `/google` | No | Initiate Google OAuth flow |
| `GET` | `/google/callback` | No | Google OAuth callback |

### User (`/api/user`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/me` | Yes | Get current user profile |
| `PUT` | `/me` | Yes | Update profile (username, mobile, etc.) |

### Friends (`/api/friend`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Yes | List accepted friends with balances |
| `GET` | `/requests/pending` | Yes | Get pending friend requests |
| `POST` | `/request` | Yes | Send a friend request |
| `POST` | `/request/:id/accept` | Yes | Accept a friend request |
| `POST` | `/request/:id/decline` | Yes | Decline a friend request |
| `DELETE` | `/:id` | Yes | Remove a friend |

### Notifications (`/api/notification`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Yes | Get all notifications (paginated) |
| `GET` | `/unread-count` | Yes | Get unread notification count |
| `PATCH` | `/read-all` | Yes | Mark all as read |
| `PATCH` | `/:id/read` | Yes | Mark one as read |
| `DELETE` | `/:id` | Yes | Delete a notification |

### Newsletter (`/api/newsletter`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/subscribe` | No | Subscribe to newsletter |
| `POST` | `/unsubscribe` | No | Unsubscribe from newsletter |
| `GET` | `/subscribers` | No | List active subscribers |

---

## Frontend Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page |
| `/login` | Login | Email/password & Google sign-in |
| `/signup` | Sign Up | New account registration |
| `/oauth/callback` | OAuth Callback | Handles Google OAuth redirect |
| `/privacy` | Privacy Policy | Privacy policy page |
| `/terms` | Terms of Service | Terms & conditions page |
| `/dashboard` | Dashboard Layout | Authenticated dashboard shell |
| `/dashboard/dashboard` | Dashboard | Overview stats & recent activity |
| `/dashboard/friends` | Friends | Friend list & requests |
| `/dashboard/transactions` | Transactions | Transaction history |
| `/dashboard/profile` | Profile | User profile management |

---

## Deployment

### Backend (Render)

| Setting | Value |
|---|---|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | 20+ |

### Frontend (Docker / Any Node Host)

The frontend includes a multi-stage [Dockerfile](Frontend/Dockerfile):

```bash
cd Frontend
docker build -t brobalance-frontend .
docker run -p 3000:3000 brobalance-frontend
```

Or deploy directly:

```bash
npm run build
npm start
```

---

## Roadmap

- [x] User authentication (JWT + Google OAuth)
- [x] Friend management with request flow
- [x] In-app notification system
- [x] Newsletter subscriptions
- [x] Responsive landing page
- [ ] Transaction recording & balance tracking
- [ ] Payment reminders
- [ ] Group expense splitting
- [ ] UPI direct payment integration
- [ ] Monthly lending reports

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  Built with ☕ by <a href="https://github.com/naamyuvraj">Yuvraj Mandal</a>
</p>
