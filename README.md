# Feedants – Competition Details Screen
### Full Stack Development Internship — Technical Assignment

A production-quality implementation of the **Competition Details** screen from the Feedants app, built as a complete full-stack feature.

---

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React Native (Expo 52, expo-router 4) |
| Backend  | Node.js + Express.js        |
| Database | MongoDB (Mongoose)          |

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── models/          # Competition, User, Registration
│   │   ├── controllers/     # authController, competitionController
│   │   ├── routes/          # /auth, /competitions
│   │   ├── middleware/      # JWT auth (strict + optional)
│   │   └── index.js         # Express app entry point
│   ├── seed.js              # Populates DB with sample data
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx           # Root layout + AuthProvider
│   │   ├── index.tsx             # Competition list (Home)
│   │   ├── login.tsx             # Login / Register screen
│   │   └── competition/[id].tsx  # ★ Competition Details screen
│   ├── components/               # 7 reusable components
│   ├── context/AuthContext.tsx   # JWT session management
│   ├── hooks/useCompetition.ts   # Competition data hook
│   ├── services/api.ts           # Typed API layer
│   ├── config.ts                 # API base URL
│   └── package.json
│
└── README.md
```

---

## How to Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)
- Expo CLI: `npm install -g expo-cli` (or use `npx`)

---

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Copy env file and configure if needed
cp .env.example .env

# Seed the database (creates competition + 2 demo users)
npm run seed

# Start the server
npm run dev        # with hot-reload (nodemon)
# OR
npm start          # production
```

Server starts at **http://localhost:3000**  
Health check: http://localhost:3000/health

---

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install
```

**Configure the API URL** in `config.ts`:

| Device            | URL to use                  |
|-------------------|-----------------------------|
| Android emulator  | `http://10.0.2.2:3000/api`  |
| iOS Simulator     | `http://localhost:3000/api` |
| Physical device   | `http://<your-local-IP>:3000/api` |

```bash
# Start Expo
npm start

# Then press  a  for Android emulator
#             i  for iOS simulator
#             w  for web (limited support)
```

---

### Demo Accounts (after seeding)

| Account            | Email                    | Password    | Status          |
|--------------------|--------------------------|-------------|-----------------|
| Arjun Sharma       | arjun@example.com        | password123 | ✅ Registered   |
| Priya Patel        | priya@example.com        | password456 | 🆕 Not registered |

---

## API Reference

| Method | Endpoint                                  | Auth     | Description                          |
|--------|-------------------------------------------|----------|--------------------------------------|
| POST   | `/api/auth/register`                      | None     | Create account                       |
| POST   | `/api/auth/login`                         | None     | Login → JWT                          |
| GET    | `/api/auth/me`                            | Required | Get current user                     |
| GET    | `/api/competitions`                       | None     | List all competitions                |
| GET    | `/api/competitions/:id`                   | Optional | Competition detail + registration status |
| POST   | `/api/competitions/:id/register`          | Required | Register (atomic spot booking)       |
| POST   | `/api/competitions/:id/submit`            | Required | Submit entry URL                     |
| GET    | `/api/competitions/:id/registration-status` | Required | Check if user is registered        |

---

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/feedants
JWT_SECRET=your_secret_here
```

---

## Assumptions & Technical Decisions

### Concurrency – Spot Booking
The most critical business requirement is preventing a competition from being over-booked when multiple users register simultaneously.

**Approach: Atomic `findOneAndUpdate` with a conditional query**

```js
Competition.findOneAndUpdate(
  {
    _id: competitionId,
    $expr: { $lt: ['$bookedSpots', '$totalSpots'] }, // spot available?
    registrationCloseDate: { $gt: new Date() },      // registration open?
  },
  { $inc: { bookedSpots: 1 } },
  { new: true }
)
```

MongoDB's document-level write lock ensures this is atomic — only one writer can win per document. The compound unique index on `(userId, competitionId)` in the Registration collection acts as a second layer of protection against duplicate registrations.

**Trade-off**: This approach requires no MongoDB replica set (unlike sessions/transactions), making local development easier. For a true multi-node production deployment, MongoDB sessions/transactions would be more rigorous but functionally equivalent for this use case.

### Authentication
JWT with 7-day expiry stored in `AsyncStorage`. Tokens are automatically attached to every API request by the `api` service. On app boot, the token is verified against `/api/auth/me`.

**Trade-off**: `AsyncStorage` is not as secure as `expo-secure-store` on mobile. For production, `expo-secure-store` would be used.

### Status Computation
Competition status (registration open, submission open, judging, completed) is computed server-side as a Mongoose virtual using the current time vs. lifecycle dates. This avoids a separate `status` field that could become stale and removes the need for cron jobs.

### Payment
Entry fee payment is **mocked** (`paymentStatus: 'paid'` on registration). Integrating Razorpay's webhook would be the production next step — the data model already has the `paymentStatus` field ready for it.

### Bilingual Content
All text content (description, judging parameters, rules) is stored as `{ en: String, hi: String }` in MongoDB. The language toggle is purely client-side — no additional API call is needed to switch languages.

---

## What I Would Improve for Production

1. **Payment integration**: Wire up Razorpay's order creation + webhook to set `paymentStatus` after actual payment confirmation.
2. **Push notifications**: Notify users when submission window opens, closes, and results are announced.
3. **File upload**: Replace URL-based submission with direct video upload to S3/Cloudflare R2.
4. **Caching**: Add Redis cache for the competition details endpoint (high read, low write ratio).
5. **Secure token storage**: Use `expo-secure-store` instead of `AsyncStorage` for JWT.
6. **Pagination**: Add cursor-based pagination to the competitions list for scale.
7. **Admin panel**: A simple dashboard to create/manage competitions without running seed.
8. **Test coverage**: Add Jest + Supertest integration tests for all API endpoints.
9. **CI/CD**: GitHub Actions pipeline for lint, test, and deploy.
10. **Observability**: Structured logging (Winston/Pino) + APM (Datadog/Sentry).
