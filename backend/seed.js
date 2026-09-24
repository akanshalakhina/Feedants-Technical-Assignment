/**
 * Seed script – populates MongoDB with 4 diverse competitions in different lifecycle
 * states and two demo users (Arjun [registered] and Priya [unregistered]).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Competition = require('./src/models/Competition');
const User = require('./src/models/User');
const Registration = require('./src/models/Registration');
const Review = require('./src/models/Review');
const Submission = require('./src/models/Submission');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedants';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB …');

  // Wipe existing data so seed is idempotent
  await Promise.all([
    Competition.deleteMany({}),
    User.deleteMany({}),
    Registration.deleteMany({}),
    Review.deleteMany({}),
    Submission.deleteMany({}),
  ]);
  console.log('Cleared existing data.');

  const now = new Date();

  // ── 1. Feedants Classical Dance (Matches provided design) ───────────────────
  const comp1 = await Competition.create({
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
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
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
      { name: 'Riya Shah',   rank: '1st', videoThumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Aarav Mehta', rank: '1st', videoThumbnailUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Neha Verma',  rank: '2nd', videoThumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Ishita Cho',  rank: '3rd', videoThumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
  });

  // ── 2. Indie Short Film Slam 2026 (Submission Open Phase) ────────────────────
  const comp2 = await Competition.create({
    title: 'Indie Short Film Slam 2026',
    category: 'Film & Video',
    tags: ['Filmmaking', 'Grand Trophy'],
    prizePool: 5000,
    entryFee: 199,
    totalSpots: 50,
    bookedSpots: 42,
    status: 'submission_open',

    judge: {
      name: 'Kabir Khan',
      title: 'National Award-Winning Director',
      experience: '18+ Years in Indian Cinema',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },

    // Registration open, submission ending in 5 days
    registrationCloseDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    submissionStartDate:   new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    submissionEndDate:     new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    resultDate:            new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),

    description: {
      en: 'A premier digital short film competition for independent directors, screenwriters, and creators across the subcontinent.',
      hi: 'उपमहाद्वीप के स्वतंत्र निर्देशकों, पटकथा लेखकों और रचनाकारों के लिए एक प्रमुख डिजिटल लघु फिल्म प्रतियोगिता।',
    },
    judgingParameters: {
      en: 'Evaluated on:\n• Storytelling & Narrative Flow\n• Cinematography & Lighting\n• Sound Design & Foley\n• Direction & Pacing',
      hi: 'मूल्यांकन के आधार:\n• कहानी और कथा प्रवाह\n• छायांकन और प्रकाश व्यवस्था\n• ध्वनि डिजाइन\n• निर्देशन और गति',
    },
    rulesAndEligibility: {
      en: '1. Film duration must be between 3 to 15 minutes.\n2. Subtitles in English required if dialogue is in regional language.\n3. Original screenplay only.',
      hi: '1. फिल्म की अवधि 3 से 15 मिनट के बीच होनी चाहिए।\n2. यदि संवाद क्षेत्रीय भाषा में है तो अंग्रेजी उपशीर्षक अनिवार्य हैं।\n3. केवल मूल पटकथा।',
    },

    rewards: [
      { position: 1, label: 'Best Director', amount: 2500, icon: 'gold' },
      { position: 2, label: 'Runner Up', amount: 1500, icon: 'silver' },
      { position: 3, label: 'Special Mention', amount: 1000, icon: 'bronze' },
    ],

    previousWinners: [
      { name: 'Devanshu Sen', rank: '1st', videoThumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { name: 'Meera Rao',    rank: '2nd', videoThumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
  });

  // ── 3. National Beatboxing Battle (Fully Booked Demo) ────────────────────────
  const comp3 = await Competition.create({
    title: 'National Beatboxing Battle 2026',
    category: 'Music',
    tags: ['Beatbox', '1v1 Clash'],
    prizePool: 3500,
    entryFee: 149,
    totalSpots: 30,
    bookedSpots: 30, // 30 / 30 Booked -> FULLY BOOKED!
    status: 'registration_open',

    judge: {
      name: 'MC Altaf',
      title: 'Underground Hip-Hop Pioneer',
      experience: '9+ Years in Battle Rap & Beatboxing',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },

    registrationCloseDate: new Date(now.getTime() + 12 * 60 * 60 * 1000),
    submissionStartDate:   new Date(now.getTime() + 14 * 60 * 60 * 1000),
    submissionEndDate:     new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    resultDate:            new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),

    description: {
      en: 'India’s fiercest underground vocal percussion battle. 30 beatboxers go head to head.',
      hi: 'भारत की सबसे कठिन भूमिगत मुखर ताल प्रतियोगिता। 30 बीटबॉक्सर्स आमने-सामने होंगे।',
    },
    judgingParameters: {
      en: 'Judged on:\n• Sound Quality & Clarity\n• Technicality & Speed\n• Musicality & Groove\n• Stage Presence',
      hi: 'मूल्यांकन:\n• ध्वनि गुणवत्ता और स्पष्टता\n• तकनीकी गति\n• संगीत और लय\n• मंच उपस्थिति',
    },
    rulesAndEligibility: {
      en: '1. Pure acoustic beatbox only — no loopstations or external FX.\n2. 90-second rounds.',
      hi: '1. केवल शुद्ध ध्वनिक बीटबॉक्स — कोई लूप स्टेशन नहीं।\n2. 90 सेकंड का राउंड।',
    },

    rewards: [
      { position: 1, label: 'Champion', amount: 2000, icon: 'gold' },
      { position: 2, label: 'Vice Champion', amount: 1000, icon: 'silver' },
      { position: 3, label: 'Top 4 Finalist', amount: 500, icon: 'bronze' },
    ],

    previousWinners: [
      { name: 'Gaurav Rawat', rank: '1st', videoThumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
  });

  // ── 4. Monsoon Street Photography (Judging Phase) ───────────────────────────
  const comp4 = await Competition.create({
    title: 'Monsoon Street Photography',
    category: 'Photography',
    tags: ['Photography', 'Exhibition'],
    prizePool: 2000,
    entryFee: 79,
    totalSpots: 15,
    bookedSpots: 15,
    status: 'judging',

    judge: {
      name: 'Raghu Rai',
      title: 'Celebrated Photojournalist',
      experience: '35+ Years with Magnum Photos & Time',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },

    registrationCloseDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // closed
    submissionStartDate:   new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    submissionEndDate:     new Date(now.getTime() - 12 * 60 * 60 * 1000), // submission closed
    resultDate:            new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // results in 3 days

    description: {
      en: 'Capture the raw, unfiltered emotions and atmospheric reflections of the Indian monsoon season on the streets.',
      hi: 'सड़कों पर भारतीय मानसून के मौसम की कच्ची, अनफ़िल्टर्ड भावनाओं और वायुमंडलीय दृश्यों को कैद करें।',
    },
    judgingParameters: {
      en: 'Judged on:\n• Composition & Golden Ratio\n• Emotional Resonance\n• Natural Lighting & Shadows\n• Unstaged Authenticity',
      hi: 'मूल्यांकन के बिंदु:\n• रचना और सुनहरा अनुपात\n• भावनात्मक अनुनाद\n• प्राकृतिक रोशनी और छाया\n• असंगठित प्रामाणिकता',
    },
    rulesAndEligibility: {
      en: '1. High-resolution JPEG/RAW only.\n2. No heavy digital manipulation or AI generation allowed.\n3. Shot within 2026.',
      hi: '1. केवल उच्च-रिज़ॉल्यूशन JPEG/RAW।\n2. किसी भी प्रकार के AI या अत्यधिक संपादन की अनुमति नहीं।\n3. वर्ष 2026 में ली गई तस्वीरें।',
    },

    rewards: [
      { position: 1, label: 'Grand Prize', amount: 1200, icon: 'gold' },
      { position: 2, label: '2nd Place', amount: 500, icon: 'silver' },
      { position: 3, label: '3rd Place', amount: 300, icon: 'bronze' },
    ],

    previousWinners: [
      { name: 'Kunal Joshi', rank: '1st', videoThumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
  });

  // ── Users ──────────────────────────────────────────────────────────────────
  const [hash1, hash2, hash3, hash4] = await Promise.all([
    bcrypt.hash('password123', 12),
    bcrypt.hash('password456', 12),
    bcrypt.hash('password789', 12),
    bcrypt.hash('passwordabc', 12),
  ]);

  const user1 = await User.create({ name: 'Arjun Sharma', email: 'arjun@example.com', passwordHash: hash1, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' });
  const user2 = await User.create({ name: 'Priya Patel',  email: 'priya@example.com', passwordHash: hash2, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' });
  const user3 = await User.create({ name: 'Sneha Roy',    email: 'sneha@example.com', passwordHash: hash3, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' });
  const user4 = await User.create({ name: 'Rohan Das',    email: 'rohan@example.com', passwordHash: hash4, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' });

  // Arjun is registered for comp1 (Classical Dance) and comp2 (Short Film)
  await Registration.create({
    userId: user1._id,
    competitionId: comp1._id,
    paymentStatus: 'not_implemented',
  });

  await Registration.create({
    userId: user1._id,
    competitionId: comp2._id,
    paymentStatus: 'not_implemented',
  });

  // Seed realistic participant reviews
  await Review.create([
    {
      competitionId: comp1._id,
      userId: user3._id,
      userName: 'Sneha Roy',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'The judging parameters are so transparent! Loved the Kathak masterclass and prompt feedback from Manju ma\'am.',
    },
    {
      competitionId: comp1._id,
      userId: user4._id,
      userName: 'Rohan Das',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Feedants gave me my first verified stage to showcase classical dance. The cash prize was credited directly into my bank within 3 days!',
    },
    {
      competitionId: comp1._id,
      userId: user2._id,
      userName: 'Priya Patel',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      rating: 4,
      comment: 'Super seamless video submission and clear rules. Looking forward to the results announcement!',
    },
  ]);

  console.log('\n✅ Seed complete with 4 diverse competitions!');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('1. Feedants Classical Dance (REG OPEN):   ', comp1._id.toString());
  console.log('2. Indie Short Film Slam 2026 (SUB OPEN):', comp2._id.toString());
  console.log('3. National Beatboxing (FULLY BOOKED):   ', comp3._id.toString());
  console.log('4. Street Photography (JUDGING PHASE):   ', comp4._id.toString());
  console.log('─────────────────────────────────────────────────────────────');
  console.log('User 1 (REGISTERED):     arjun@example.com / password123');
  console.log('User 2 (NOT registered): priya@example.com / password456');
  console.log('─────────────────────────────────────────────────────────────');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
