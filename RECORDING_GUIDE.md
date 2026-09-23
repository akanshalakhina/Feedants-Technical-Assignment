# 🎥 Feedants Technical Assignment – Screen Recording Guide & Script

This guide is designed to help you record a crisp, impactful, and complete demo video (around 2 to 3 minutes) that checks off every evaluation criteria required by the Feedants team.

---

## 🛠️ Step 0: Pre-Recording Checklist

Before you press record, make sure:

1. **MongoDB is running**:
   ```bash
   mongod
   ```
2. **Database is seeded with clean data**:
   ```bash
   cd backend
   npm run seed
   ```
   *(This gives you 1 competition, Arjun [registered], and Priya [unregistered]).*

3. **Backend is running**:
   ```bash
   npm run dev
   ```
   *(Verify http://localhost:3000/health returns `{"status":"ok"}`).*

4. **Frontend is running**:
   ```bash
   cd frontend
   npm start
   ```
   *(Open in Android Emulator / iOS Simulator / Expo Go).*

5. **Screen Setup**:
   - Have the app on screen (mobile emulator).
   - Optional but recommended: Keep your terminal or VS Code visible in split-screen (or show MongoDB Compass / backend terminal briefly) to demonstrate dynamic server requests when actions occur.

---

## ⏱️ Video Breakdown (Target: 2 to 3 minutes)

| Time | Section | Screen Focus |
|---|---|---|
| **0:00 - 0:25** | Intro & Overview | Architecture & Home Feed |
| **0:25 - 1:00** | Competition Details & UI Highlights | Countdown, Dates, Tabs, Languages |
| **1:00 - 1:40** | Dynamic User States & Live Registration | Priya's flow: Login -> Register -> Spot decrement |
| **1:40 - 2:15** | State Persistence & Submission Window | Arjun's flow: Already registered -> Upload Submission |
| **2:15 - 2:40** | Concurrency & Technical Highlights | Explanation of atomic operations & MongoDB schema |
| **2:40 - 3:00** | Wrap-up | Closing thoughts |

---

## 🎙️ Step-by-Step Recording Script

### 1. Introduction (0:00 - 0:25)
* **Action:** Start on the Home screen showing the list of competitions.
* **What to say:**
  > *"Hi everyone, this is my submission for the Feedants Full Stack Development Internship technical assignment. I've built the Competition Details feature using React Native with Expo, Node.js with Express, and MongoDB. As requested, all data is completely dynamic and driven by the backend rather than hardcoded."*

---

### 2. Exploring Competition Details & UI Fidelity (0:25 - 1:00)
* **Action:** Tap into the "Feedants Classical Dance" competition.
* **What to show & say:**
  * **Design Fidelity:** *"Here is the Competition Details screen matching the provided UI design."*
  * **Real-time Countdown:** Point out the live countdown timer ticking down to the registration deadline:
    > *"Notice the real-time countdown timer ticking second by second, calculated dynamically against the registration close date from MongoDB."*
  * **Important Dates & Judge Card:** Scroll through the Judge info card, intro video trigger, and 2x2 Important Dates grid.
  * **Previous Winners & Rewards:** Show the horizontally scrolling Previous Winners list with rank badges and the Rewards breakdown.
  * **Bilingual Toggle:** Tap between `ENG` and `हिंदी` in the top right header:
    > *"All text content is stored bilingually in MongoDB. Toggling between English and Hindi immediately re-renders the description, judging criteria, and rules."*
  * **Collapsible Tabs:** Tap between "About Competition", "Judging Parameters", and "Rules & Eligibility", and click "View more / View less".

---

### 3. Dynamic User Flow & Registration (1:00 - 1:40)
* **Action:** Look at the bottom action button while unauthenticated.
* **What to say:**
  > *"Currently, no user is logged in. The dynamic CTA recognizes this state and prompts 'Login to Register'."*
* **Action:** Tap "Login to Register" -> Log in as Priya:
  - **Email:** `priya@example.com`
  - **Password:** `password456`
* **Action:** Returning to the competition screen:
  * Note the CTA changes to **"Register Now ₹99"**.
  * Note the spot indicator: **"Only 19 spots left (1/20 Booked)"**.
* **Action:** Tap **"Register Now ₹99"**:
  * Show the success popup.
  * Note the immediate UI transformation:
    - Top badge updates to **"✓ Registered"**.
    - Spot indicator updates to **"Only 18 spots left (2/20 Booked)"**.
    - Bottom button transitions to **"Upload Submission"**.

---

### 4. Registered State & Submission Flow (1:40 - 2:15)
* **Action:**
  * Tap **"Upload Submission"** to demonstrate entry submission.
  * Show the prompt / modal accepting a video URL (YouTube, Drive).
  * Submit a URL -> Show success confirmation.
  * Button reflects submission state.
* **Action (Show user state persistence):**
  * Log out and log in as **Arjun** (`arjun@example.com` / `password123`):
  > *"Arjun was already registered in the database seed. When we view the competition as Arjun, the system immediately recognizes his registration record without requiring any redundant actions."*
  * Demonstrate copying his personalized referral link (`feedants.com/r/...`).

---

### 5. Backend Architecture & Concurrency Highlights (2:15 - 2:45)
* **Action:** Briefly switch to VS Code or explain the backend logic.
* **Key points to highlight:**
  > *"To ensure scalability and prevent overbooking under high traffic, registration is handled atomically in MongoDB using `findOneAndUpdate` with condition `bookedSpots < totalSpots` alongside a compound unique index on `(userId, competitionId)`. This prevents race conditions and overselling even with thousands of concurrent requests without needing heavy transactions or locks."*

---

### 6. Conclusion (2:45 - 3:00)
* **What to say:**
  > *"The repository contains full instructions, environment configurations, and a comprehensive README discussing assumptions, architectural decisions, and production trade-offs. Thank you!"*

---

## 💡 Quick Tips for a Polished Video
- **Resolution:** 1080p or 720p with clear legible fonts.
- **Audio:** Clear voice with minimal background noise.
- **Pacing:** Keep movements smooth and deliberate — give viewers a moment to see the spot count and CTA changes.
- **Upload options:** You can host your recording on Loom, YouTube (Unlisted), or Google Drive (make sure link sharing is set to 'Anyone with the link can view').
