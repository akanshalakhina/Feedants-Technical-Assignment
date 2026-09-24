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
│   │   ├── models/          # Competition, User, Registration, Review, Submission
│   │   ├── controllers/     # authController, competitionController, reviewController
│   │   ├── routes/          # /auth, /competitions
│   │   ├── middleware/      # JWT auth (strict + optional)
│   │   └── index.js         # Express app entry point
│   ├── seed.js              # Populates DB with realistic sample competitions & reviews
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx           # Mobile frame wrapper + AuthProvider + responsive frame
│   │   ├── index.tsx             # Competition list (Home)
│   │   ├── login.tsx             # Login / Register screen
│   │   └── competition/[id].tsx  # ★ Competition Details screen (Modular)
│   ├── components/
│   │   ├── CompetitionHeader.tsx # Header, back nav, language toggle, status badge, tags
│   │   ├── CompetitionStats.tsx  # Prize pool, fee, spot progress & remaining spots from DB
│   │   ├── JudgeCard.tsx         # Judge profile, photo, title, experience, video action
│   │   ├── CountdownTimer.tsx    # Live countdown timer with 'Hurry up!' badge
│   │   ├── ImportantDates.tsx    # 2x2 grid card (Register, Submission, Result dates)
│   │   ├── PreviousWinners.tsx   # Horizontal winners scroll with video reels
│   │   ├── TabSection.tsx        # About, Judging Parameters, Rules & Eligibility tabs
│   │   ├── RewardsList.tsx       # Position rewards with medals/stars and teal amounts
│   │   ├── PaymentAndReferral.tsx# Disclaimer, prize FAQ, Razorpay badge, Refer & Earn
│   │   ├── ReviewsSection.tsx    # Dynamic MongoDB reviews list + 'Hear From Our Users'
│   │   ├── AddReviewModal.tsx    # Interactive star rating (1-5) and review submission
│   │   ├── BottomCTA.tsx         # Large sticky bottom action button
│   │   ├── BottomNavigation.tsx  # 5-tab Feedants mobile navigation bar
│   │   └── SpotsProgress.tsx     # Animated spots indicator with progress bar
│   ├── context/AuthContext.tsx   # JWT session management
│   ├── hooks/useCompetition.ts   # Competition data hook with 3s live polling
│   ├── services/api.ts           # Typed API layer (auth, competitions, reviews)
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
| GET    | `/api/auth/me`                            | Required | Get current user profile             |
| GET    | `/api/competitions`                       | None     | List all competitions                |
| GET    | `/api/competitions/:id`                   | Optional | Competition detail + registration status |
| GET    | `/api/competitions/:id/winners`           | None     | Fetch list of previous winners       |
| GET    | `/api/competitions/:id/reviews`           | None     | Fetch dynamic user reviews & ratings |
| POST   | `/api/competitions/:id/reviews`           | Required | Submit a review (1-5 stars + text)   |
| GET    | `/api/competitions/:id/participation`     | Required | Check user participation status      |
| POST   | `/api/competitions/:id/register`          | Required | Register (atomic spot booking)       |
| POST   | `/api/competitions/:id/submission`        | Required | Submit entry video URL               |


---

## Database Models

- **Competition**: Title, category, tags, prizePool, entryFee, totalSpots, bookedSpots, spotsRemaining (virtual), computedStatus (virtual), judge (name, title, experience, photoUrl, introVideoUrl), dates (registrationCloseDate, submissionStartDate, submissionEndDate, resultDate), bilingual content (en/hi), rewards array, previousWinners array.
- **User**: Name, email, passwordHash, avatarUrl, referralCode.
- **Registration**: userId, competitionId, paymentStatus, submissionUrl, submittedAt, timestamps. Compound unique index `{ userId: 1, competitionId: 1 }`.
- **Review**: competitionId, userId, userName, userAvatar, rating (1-5), comment, timestamps. Compound unique index `{ competitionId: 1, userId: 1 }`.
- **Submission**: competitionId, userId, videoUrl, title, description, status, timestamps. Compound unique index `{ competitionId: 1, userId: 1 }`.

---

## Environment Variables

Create a `.env` file inside `backend/` (refer to `backend/.env.example`):

```env
# Server port
PORT=3000

# MongoDB Connection String (standalone or replica set)
MONGO_URI=mongodb://127.0.0.1:27017/feedants

# Secret key for JWT session tokens
JWT_SECRET=your_super_secret_key_change_in_production

# Optional environment setting
NODE_ENV=development
```

---

## Technical Assignment Rubric Compliance

### 1. Important Assumptions
1. **User Identity & Auth**: In a real app, users authenticate via OTP/phone or social login. Here, we implemented standard email/password with JWT tokens stored via `AsyncStorage` and auto-loaded on boot.
2. **Payment Flow**: Payment is **NOT IMPLEMENTED**. The assignment scope is the Competition Details screen, not the payment gateway. `paymentStatus` is stored as `'not_implemented'` in the database to be explicit. When Razorpay integration is added, this field transitions to `'paid'` or `'failed'` via a webhook listener (see Production Improvements).
3. **Submission Format**: Video submissions are submitted via streaming URL (YouTube, Vimeo, Cloudflare Stream, or direct MP4 link), which is validated by the server and client.
4. **Time & Timezones**: All lifecycle timestamps (`registrationCloseDate`, `submissionStartDate`, `submissionEndDate`, `resultDate`) are stored in UTC ISO-8601 format and converted to the user's local timezone for countdowns and display.
5. **Platform Target**: The app is built with pure React Native components (`View`, `Text`, `ScrollView`, `TouchableOpacity`, `Pressable`, `StyleSheet`, `Modal`, `TextInput`, `ActivityIndicator`) runnable natively on iOS and Android via Expo, with automatic responsive framing when previewed in web browsers.

---

### 2. Major Technical Decisions
1. **Atomic Concurrency (Zero Overbooking)**:
   To prevent race conditions when thousands of users attempt to register simultaneously for limited spots, we avoid read-modify-write patterns. Instead, we use MongoDB's atomic document update:
   ```javascript
   Competition.findOneAndUpdate(
     {
       _id: competitionId,
       $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
       registrationCloseDate: { $gt: new Date() },
     },
     { $inc: { bookedSpots: 1 } },
     { new: true }
   )
   ```
   MongoDB's document-level write lock ensures that only requests with an available spot can increment `bookedSpots`.
2. **Compound Unique Index for Idempotency**:
   On the `Registration` collection, a compound unique index `{ userId: 1, competitionId: 1 }` guarantees that no user can register twice, even if concurrent duplicate HTTP requests are fired.
3. **Mongoose Virtuals for Lifecycle State**:
   Instead of storing a static status that can drift over time, `computedStatus` and `spotsRemaining` are computed dynamically from current timestamp vs. competition dates.
4. **Pure React Native Vector Icons**:
   Instead of bundling platform-specific font files that can break across native environments or web bundlers, all icons are built using clean, cross-platform React Native SVG vector components.
5. **Separation of Concerns**:
   The Competition Details screen is broken down into 13 modular, reusable components with zero business-logic coupling, making the codebase clean, readable, and maintainable.

---

### 3. Trade-offs Considered
1. **Standalone Atomic Update vs. Multi-Document Transactions**:
   - *Choice*: Used atomic `findOneAndUpdate` with rollback on duplicate key error.
   - *Rationale*: MongoDB transactions require a replica set or Atlas cluster. By using conditional atomic updates, the project can be cloned, seeded, and run instantly on any standard local MongoDB instance while maintaining 100% data consistency.
2. **Polling vs. WebSockets for Spot Updates**:
   - *Choice*: Short-interval polling in `useCompetition` hook.
   - *Rationale*: WebSockets introduce connection state management overhead. For a details screen, lightweight HTTP polling is resilient to network drops and battery-friendly.
3. **Client-Side Bilingual Toggle**:
   - *Choice*: Stored `{ en: String, hi: String }` in MongoDB and switched client-side.
   - *Rationale*: Eliminates redundant network requests when switching between English and Hindi, providing an instantaneous, zero-latency user experience.

---

### 4. Production Improvements & Scalability
If this module were developed further for a production system supporting millions of users:
1. **Redis Caching**: Cache competition details and previous winners with Redis / Cloudflare KV to handle high read volumes.
2. **Queue-Based Booking for Flash Registrations**: For viral competitions where 10,000+ users register in seconds, put requests into a BullMQ / AWS SQS queue to smooth out peak database load.
3. **Native Secure Storage**: Use `expo-secure-store` (Keychain on iOS, Keystore on Android) for JWT storage.
4. **Direct Media Upload**: Implement direct pre-signed S3 / Cloudflare R2 uploads for video entries rather than URL submission.
5. **Webhook Payment Integration**: Connect Razorpay webhook listeners to transition `paymentStatus` from `pending` to `paid` upon verified capture.
6. **Automated Integration Testing**: The repository already includes a complete automated Jest test suite (`backend/src/tests/api.test.js`) verifying health, validation, atomic spot booking, duplicate 409 prevention, and dev-route protection. In production, this would be wired to GitHub Actions CI/CD.

---

## Verification & Testing

### Running Backend Smoke & Concurrency Tests:
```bash
cd backend
npm test
```
**Test Results**: 9/9 Tests Passed:
- `GET /health` (200 OK)
- `GET /api/competitions` (List active competitions)
- `GET /api/competitions/:id` (Details + lifecycle dates)
- `GET /api/competitions/invalid-id` (400 Bad Request)
- `POST /api/competitions/:id/register` without auth (401 Unauthorized)
- `POST /api/competitions/:id/register` with auth (Atomic spot reservation, paymentStatus: not_implemented)
- Duplicate registration attempt (409 Conflict + spots rollback)
- Real submission persistence: URL saved and readable from DB after refresh
- Real reviews persistence: Review saved, average rating recalculated, readable from DB after refresh

### Running Frontend Type-Check:
```bash
cd frontend
npx tsc --noEmit
```
**Result**: 0 TypeScript compilation errors.
