/**
 * Seed script – populates the database with one sample competition and two users.
 *
 * Usage:
 *   cp .env.example .env          # configure MONGO_URI if needed
 *   npm run seed
 *
 * Credentials after seeding:
 *   ✅ Already registered:  arjun@example.com  / password123
 *   🆕 Not yet registered:  priya@example.com  / password456
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Competition = require('./src/models/Competition');
const User = require('./src/models/User');
const Registration = require('./src/models/Registration');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedants';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB …');

  // Wipe existing data so the script is idempotent
  await Promise.all([
    Competition.deleteMany({}),
    User.deleteMany({}),
    Registration.deleteMany({}),
  ]);
  console.log('Cleared existing data.');

  const now = new Date();

  // ── Competition ────────────────────────────────────────────────────────────
  const competition = await Competition.create({
    title: 'Feedants Classical Dance',
    category: 'Dance',
    tags: ['Dance', 'Multi-Win'],
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    bookedSpots: 1,
    status: 'registration_open',

    judge: {
      name: 'Manju Dubey',
      title: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },

    // Registration closes ~30 hours from now (matches the design's "01d 06h 28m")
    registrationCloseDate: new Date(now.getTime() + 30 * 60 * 60 * 1000),
    submissionStartDate:   new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // already open
    submissionEndDate:     new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
    resultDate:            new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),

    description: {
      en: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      hi: 'यह एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है जो सभी आयु वर्गों के लिए खुली है। कहीं से भी भाग लें और अपनी प्रतिभा दिखाएं। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें।',
    },
    judgingParameters: {
      en: 'Participants will be evaluated on:\n• Technical Accuracy – correct execution of classical mudras and footwork.\n• Expression & Emotion – ability to convey the rasa of the piece.\n• Costume & Presentation – appropriateness and visual appeal.\n• Rhythm & Timing – synchronisation with the chosen raga/tala.\n• Overall Performance – stage presence and audience connect.',
      hi: 'प्रतिभागियों का मूल्यांकन इन आधारों पर किया जाएगा:\n• तकनीकी सटीकता – मुद्राओं और पदकार्य का सही निष्पादन।\n• भाव-भंगिमा – रस की अभिव्यक्ति।\n• वेशभूषा और प्रस्तुति – उचित और आकर्षक।\n• लय और समय – राग/ताल के साथ समन्वय।\n• समग्र प्रदर्शन – मंच उपस्थिति।',
    },
    rulesAndEligibility: {
      en: '1. Open to all age groups globally.\n2. Video must be 2–5 minutes long.\n3. Solo performances only — no duets or group acts.\n4. Must be recorded in good, natural lighting.\n5. Only original classical dance forms are accepted.\n6. No playback (lip-sync) singing allowed.\n7. One entry per registration.',
      hi: '1. विश्वभर में सभी आयु वर्गों के लिए खुला।\n2. वीडियो 2–5 मिनट लंबा होना चाहिए।\n3. केवल एकल प्रदर्शन — कोई युगल या समूह नहीं।\n4. अच्छी, प्राकृतिक रोशनी में रिकॉर्ड किया जाना चाहिए।\n5. केवल मूल शास्त्रीय नृत्य रूप स्वीकार किए जाते हैं।\n6. प्लेबैक गायन की अनुमति नहीं।\n7. एक पंजीकरण में एक ही प्रविष्टि।',
    },

    rewards: [
      { position: 1, label: '1st Winner', amount: 550, icon: 'gold' },
      { position: 2, label: '2nd Winner', amount: 300, icon: 'silver' },
      { position: 3, label: '3rd Winner', amount: 240, icon: 'bronze' },
      { position: 4, label: '4th Winner', amount: 200, icon: 'star' },
      { position: 5, label: '5th Winner', amount: 130, icon: 'star' },
      { position: 6, label: '6th Winner', amount:  80, icon: 'star' },
    ],

    previousWinners: [
      { name: 'Riya Shah',   rank: '1st', videoThumbnailUrl: 'https://picsum.photos/seed/riya/200/200',   videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Aarav Mehta', rank: '1st', videoThumbnailUrl: 'https://picsum.photos/seed/aarav/200/200',  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Neha Verma',  rank: '2nd', videoThumbnailUrl: 'https://picsum.photos/seed/neha/200/200',   videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Ishita Cho',  rank: '3rd', videoThumbnailUrl: 'https://picsum.photos/seed/ishita/200/200', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
  });

  // ── Users ──────────────────────────────────────────────────────────────────
  const [hash1, hash2] = await Promise.all([
    bcrypt.hash('password123', 12),
    bcrypt.hash('password456', 12),
  ]);

  const user1 = await User.create({ name: 'Arjun Sharma', email: 'arjun@example.com', passwordHash: hash1 });
  const user2 = await User.create({ name: 'Priya Patel',  email: 'priya@example.com', passwordHash: hash2 });

  // user1 is already registered (matches bookedSpots: 1)
  await Registration.create({
    userId: user1._id,
    competitionId: competition._id,
    paymentStatus: 'paid',
  });

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────────────');
  console.log('Competition ID:', competition._id.toString());
  console.log('─────────────────────────────────────────');
  console.log('User 1 (REGISTERED):     arjun@example.com / password123');
  console.log('User 2 (NOT registered): priya@example.com / password456');
  console.log('─────────────────────────────────────────');
  console.log('\nPaste the Competition ID into the app or open:');
  console.log(`  http://localhost:3000/api/competitions/${competition._id}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
