import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../context/AuthContext';
import { api, Competition, Registration, User } from '../../services/api';

import { CompetitionHeader, Language } from '../../components/CompetitionHeader';
import { CompetitionStats } from '../../components/CompetitionStats';
import { JudgeCard } from '../../components/JudgeCard';
import { CountdownTimer } from '../../components/CountdownTimer';
import { ImportantDates } from '../../components/ImportantDates';
import { PreviousWinners } from '../../components/PreviousWinners';
import { TabSection } from '../../components/TabSection';
import { RewardsList } from '../../components/RewardsList';
import { PaymentAndReferral } from '../../components/PaymentAndReferral';
import { ReviewsSection } from '../../components/ReviewsSection';
import { BottomCTA, CTAState } from '../../components/BottomCTA';
import { BottomNavigation } from '../../components/BottomNavigation';

// ─── CTA Lifecycle Business Logic ─────────────────────────────────────────────

function computeCTA(
  competition: Competition,
  isRegistered: boolean,
  registration: Registration | null,
  user: User | null
): CTAState {
  const now = new Date();
  const regClose = new Date(competition.registrationCloseDate);
  const subStart = new Date(competition.submissionStartDate);
  const subEnd = new Date(competition.submissionEndDate);
  const hasSpots = competition.bookedSpots < competition.totalSpots;
  const hasSubmitted = !!registration?.submissionUrl;

  if (!user) {
    return { label: 'Login to Register', disabled: false, action: 'login' };
  }

  if (isRegistered) {
    if (now >= subStart && now <= subEnd) {
      return hasSubmitted
        ? { label: '✓ Submission Uploaded', subLabel: 'Under Review', disabled: true, action: null }
        : { label: 'Upload Submission', subLabel: 'Registered', disabled: false, action: 'upload' };
    }
    if (now < subStart) {
      return { label: '✓ Registered', subLabel: 'Submission opens soon', disabled: true, action: null };
    }
    return { label: 'Submission Closed', disabled: true, action: null };
  }

  if (!hasSpots) return { label: 'Fully Booked', disabled: true, action: null };
  if (now > regClose) return { label: 'Registration Closed', disabled: true, action: null };

  return { label: 'Register Now', subLabel: `₹ ${competition.entryFee}`, disabled: false, action: 'register' };
}

// ─── Competition Details Screen ───────────────────────────────────────────────

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const {
    competition,
    isRegistered: apiIsRegistered,
    registration,
    isLoading,
    error,
    refetch,
  } = useCompetition(id ?? '');

  // Local optimistic & confirmed state
  const [isRegistered, setIsRegistered] = useState(false);
  const [localRegistration, setLocalRegistration] = useState<Registration | null>(null);
  const [registering, setRegistering] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Interactive live simulation and video preview states
  const [simulating, setSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
  }>({ visible: false, title: '', subtitle: '' });

  useEffect(() => {
    setIsRegistered(apiIsRegistered);
    setLocalRegistration(registration);
  }, [apiIsRegistered, registration]);

  // ── Concurrency Simulation Handler ──────────────────────────────────────────

  const handleSimulateBooking = useCallback(async () => {
    if (!competition) return;
    setSimulating(true);
    try {
      const res = await api.competitions.simulateBooking(competition._id);
      setSimulationToast(res.message);
      refetch();
      setTimeout(() => setSimulationToast(null), 4000);
    } catch (e: unknown) {
      Alert.alert('Simulation Error', e instanceof Error ? e.message : 'Booking failed');
    } finally {
      setSimulating(false);
    }
  }, [competition, refetch]);

  const handleResetSpots = useCallback(async () => {
    if (!competition) return;
    try {
      const res = await api.competitions.resetSpots(competition._id);
      refetch();
      setSimulationToast(res.message);
      setTimeout(() => setSimulationToast(null), 3000);
    } catch (e: unknown) {
      Alert.alert('Reset Error', e instanceof Error ? e.message : 'Reset failed');
    }
  }, [competition, refetch]);

  // ── Atomic Registration Handler ─────────────────────────────────────────────

  const handleRegister = useCallback(async () => {
    if (!competition) return;
    setRegistering(true);
    try {
      const { registration: reg } = await api.competitions.register(competition._id);
      setIsRegistered(true);
      setLocalRegistration(reg);
      refetch();
      Alert.alert('🎉 Registered!', 'You have successfully registered for this competition.');
    } catch (err: unknown) {
      Alert.alert('Registration Failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setRegistering(false);
    }
  }, [competition, refetch]);

  // ── Submission Handler ──────────────────────────────────────────────────────

  const handleUpload = useCallback(() => {
    if (!competition) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = window.prompt(
        'Enter your submission video URL (YouTube, Vimeo, Google Drive):',
        'https://youtube.com/watch?v=feedants_dance_entry'
      );
      if (url && url.trim()) {
        api.competitions
          .submitEntry(competition._id, url.trim())
          .then(({ registration: reg }) => {
            setLocalRegistration(reg);
            Alert.alert('✅ Submitted!', 'Your video entry has been recorded.');
          })
          .catch((e: unknown) =>
            Alert.alert('Submission Error', e instanceof Error ? e.message : 'Submission failed')
          );
      }
    } else {
      // Mobile / demo flow
      api.competitions
        .submitEntry(competition._id, 'https://youtube.com/watch?v=feedants_demo_entry')
        .then(({ registration: reg }) => {
          setLocalRegistration(reg);
          Alert.alert('✅ Submitted!', 'Your demo video entry has been recorded.');
        })
        .catch((e: unknown) =>
          Alert.alert('Submission Error', e instanceof Error ? e.message : 'Submission failed')
        );
    }
  }, [competition]);

  const handleCTAPress = useCallback(() => {
    if (!competition) return;
    const cta = computeCTA(competition, isRegistered, localRegistration, user);
    if (cta.action === 'login') router.push('/login');
    else if (cta.action === 'register') handleRegister();
    else if (cta.action === 'upload') handleUpload();
  }, [competition, isRegistered, localRegistration, user, router, handleRegister, handleUpload]);

  // ── Loading & Error States ──────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#16A093" />
        <Text style={styles.loadingText}>Loading competition details…</Text>
      </SafeAreaView>
    );
  }

  if (error || !competition) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Competition not found'}</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: '#16A093', fontWeight: '600' }}>← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Derived View Data ───────────────────────────────────────────────────────

  const cta = computeCTA(competition, isRegistered, localRegistration, user);

  const tabs = [
    { key: 'about', label: 'About Competition', content: competition.description[language] },
    { key: 'judging', label: 'Judging Parameters', content: competition.judgingParameters[language] },
    { key: 'rules', label: 'Rules & Eligibility', content: competition.rulesAndEligibility[language] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Scrollable Body ──────────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header (Back button + Language selector) */}
        <CompetitionHeader
          language={language}
          onLanguageChange={setLanguage}
          onBack={() => router.back()}
        />

        {/* Top Competition Card (Title, Status Badge, Tags, Financials & Spot Progress) */}
        <CompetitionStats
          title={competition.title}
          tags={competition.tags}
          isRegistered={isRegistered}
          prizePool={competition.prizePool}
          entryFee={competition.entryFee}
          totalSpots={competition.totalSpots}
          bookedSpots={competition.bookedSpots}
        />

        {/* Judge Card with Intro Video action */}
        <JudgeCard
          judge={competition.judge}
          onVideoPress={() =>
            setVideoModal({
              visible: true,
              title: `${competition.judge.name}'s Introduction`,
              subtitle: `${competition.judge.title} • ${competition.judge.experience}`,
            })
          }
        />

        {/* Dynamic Countdown Timer with Hurry Up badge */}
        <CountdownTimer
          targetDate={competition.registrationCloseDate}
          label="Registration closes in"
        />

        {/* Important Dates 2x2 Unified Card */}
        <ImportantDates
          registerBefore={competition.registrationCloseDate}
          submissionStarts={competition.submissionStartDate}
          submissionEnds={competition.submissionEndDate}
          resultDate={competition.resultDate}
        />

        {/* Previous Winners Horizontal Reel */}
        <PreviousWinners
          winners={competition.previousWinners}
          onVideoPress={(w) =>
            setVideoModal({
              visible: true,
              title: `${w.name} (${w.rank} Place)`,
              subtitle: `Performance Reel from previous Feedants competition`,
            })
          }
        />

        {/* Competition Details Tabs (About, Judging, Rules) with View more */}
        <TabSection tabs={tabs} />

        {/* Rewards Section with Ranks and Amounts */}
        <RewardsList rewards={competition.rewards} />

        {/* Payment, Disclaimer, Video FAQ & Referral Card */}
        <PaymentAndReferral
          referralCode={user?.referralCode}
          onPrizeInfoPress={() =>
            setVideoModal({
              visible: true,
              title: 'Prize Money Transfer Process',
              subtitle: 'Automated direct bank transfer within 7 days of results',
            })
          }
        />

        {/* Dynamic Reviews from MongoDB with + Add Review flow */}
        <ReviewsSection
          competitionId={competition._id}
          isLoggedIn={!!user}
          onLoginPrompt={() => router.push('/login')}
        />

        {/* Advertisement Placeholder matching reference */}
        <View style={styles.adBox}>
          <Text style={styles.adText}>📢 Ad Here</Text>
        </View>

        {/* Spacer to prevent content being covered by sticky BottomCTA and BottomNavigation */}
        <View style={{ height: 130 }} />
      </ScrollView>

      {/* ── Fixed Bottom Sticky CTA ──────────────────────────────────────────── */}
      <BottomCTA cta={cta} registering={registering} onPress={handleCTAPress} />

      {/* ── Fixed Bottom Navigation Bar (5 tabs) ─────────────────────────────── */}
      <BottomNavigation
        activeTab="competitions"
        onHomePress={() => router.push('/')}
        onProfilePress={() => (!user ? router.push('/login') : undefined)}
      />

      {/* ── Video / Media Preview Modal ──────────────────────────────────────── */}
      {videoModal.visible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {videoModal.title}
              </Text>
              <TouchableOpacity
                onPress={() => setVideoModal({ visible: false, title: '', subtitle: '' })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{videoModal.subtitle}</Text>

            <View style={styles.videoPlayerFrame}>
              <View style={styles.playPulseCircle}>
                <Text style={styles.videoPlayerIcon}>▶</Text>
              </View>
              <Text style={styles.videoPlayerText}>Streaming HD Performance Reel</Text>
              <Text style={styles.videoStreamDuration}>01:42 / 03:30</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setVideoModal({ visible: false, title: '', subtitle: '' })}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDoneText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    backgroundColor: '#F8F9FA',
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    fontSize: 15,
    color: '#E05C2C',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: TEAL,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '700',
  },
  adBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 6,
  },
  adText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  modalClose: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: 'bold',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  videoPlayerFrame: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  playPulseCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  videoPlayerIcon: {
    fontSize: 22,
    color: '#FFF',
    marginLeft: 3,
  },
  videoPlayerText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
    marginBottom: 4,
  },
  videoStreamDuration: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '45%',
    height: '100%',
    backgroundColor: TEAL,
  },
  modalDoneBtn: {
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modalDoneText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
