import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Alert,
  Clipboard, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../context/AuthContext';
import { api, Competition, Registration, User } from '../../services/api';

import { CountdownTimer }  from '../../components/CountdownTimer';
import { JudgeCard }       from '../../components/JudgeCard';
import { SpotsProgress }   from '../../components/SpotsProgress';
import { ImportantDates }  from '../../components/ImportantDates';
import { PreviousWinners } from '../../components/PreviousWinners';
import { RewardsList }     from '../../components/RewardsList';
import { TabSection }      from '../../components/TabSection';

// ─── CTA logic ────────────────────────────────────────────────────────────────

type CTAAction = 'login' | 'register' | 'upload' | null;

interface CTAState {
  label:    string;
  disabled: boolean;
  action:   CTAAction;
}

function computeCTA(
  competition: Competition,
  isRegistered: boolean,
  registration: Registration | null,
  user: User | null,
): CTAState {
  const now      = new Date();
  const regClose = new Date(competition.registrationCloseDate);
  const subStart = new Date(competition.submissionStartDate);
  const subEnd   = new Date(competition.submissionEndDate);
  const hasSpots = competition.bookedSpots < competition.totalSpots;
  const hasSubmitted = !!registration?.submissionUrl;

  if (!user) {
    return { label: 'Login to Register', disabled: false, action: 'login' };
  }

  if (isRegistered) {
    if (now >= subStart && now <= subEnd) {
      return hasSubmitted
        ? { label: '✓ Submission Uploaded', disabled: true,  action: null }
        : { label: 'Upload Submission',      disabled: false, action: 'upload' };
    }
    if (now < subStart) {
      return { label: '✓ Registered — Submission opens soon', disabled: true, action: null };
    }
    return { label: 'Submission Closed', disabled: true, action: null };
  }

  if (!hasSpots)      return { label: 'Fully Booked',         disabled: true, action: null };
  if (now > regClose) return { label: 'Registration Closed',  disabled: true, action: null };

  return { label: `Register Now  ₹${competition.entryFee}`, disabled: false, action: 'register' };
}

// ─── Screen ──────────────────────────────────────────────────────────────────

type Language = 'en' | 'hi';

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { user } = useAuth();

  const { competition, isRegistered: apiIsRegistered, registration, isLoading, error, refetch }
    = useCompetition(id ?? '');

  // Keep local copy of registration state so UI updates instantly on register
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

  // ── Handlers ───────────────────────────────────────────────────────────────

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

  const handleRegister = useCallback(async () => {
    if (!competition) return;
    setRegistering(true);
    try {
      const { registration: reg } = await api.competitions.register(competition._id);
      setIsRegistered(true);
      setLocalRegistration(reg);
      refetch(); // refresh full competition data (spot count updates)
      Alert.alert('🎉 Registered!', 'You have successfully registered for this competition.');
    } catch (err: unknown) {
      Alert.alert('Registration Failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setRegistering(false);
    }
  }, [competition, refetch]);

  const handleUpload = useCallback(() => {
    if (!competition) return;
    Alert.prompt(
      'Upload Submission',

      'Paste your video URL (YouTube, Drive, etc.)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async (url) => {
            if (!url?.trim()) return;
            try {
              const { registration: reg } = await api.competitions.submitEntry(competition._id, url.trim());
              setLocalRegistration(reg);
              Alert.alert('✅ Submitted!', 'Your entry has been recorded.');
            } catch (e: unknown) {
              Alert.alert('Submission Failed', e instanceof Error ? e.message : 'Please try again.');
            }
          },
        },
      ],
      'plain-text'
    );
  }, [competition]);

  const handleCTAPress = useCallback(() => {
    if (!competition) return;
    const cta = computeCTA(competition, isRegistered, localRegistration, user);
    if (cta.action === 'login')    router.push('/login');
    else if (cta.action === 'register') handleRegister();
    else if (cta.action === 'upload') {
      // Alert.prompt only works on iOS; show web prompt or Android demo submission
      if (Platform.OS === 'ios') {
        handleUpload();
      } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const url = window.prompt(
          'Enter your submission video URL (YouTube, Drive, etc.):',
          'https://youtube.com/watch?v=demo_classical_dance'
        );
        if (url && url.trim()) {
          api.competitions
            .submitEntry(competition._id, url.trim())
            .then(({ registration: reg }) => {
              setLocalRegistration(reg);
              Alert.alert('✅ Submitted!', 'Your entry URL has been recorded.');
            })
            .catch((e: unknown) =>
              Alert.alert('Error', e instanceof Error ? e.message : 'Submission failed')
            );
        }
      } else {
        // Android: submit demo URL for showcase
        api.competitions
          .submitEntry(competition._id, 'https://youtube.com/watch?v=demo_submission')
          .then(({ registration: reg }) => {
            setLocalRegistration(reg);
            Alert.alert('✅ Submitted!', 'Your demo entry URL has been recorded.');
          })
          .catch((e: unknown) =>
            Alert.alert('Error', e instanceof Error ? e.message : 'Submission failed')
          );
      }
    }
  }, [competition, isRegistered, localRegistration, user, router, handleRegister, handleUpload]);

  // ── Loading / Error states ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#16A093" />
        <Text style={styles.loadingText}>Loading competition…</Text>
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
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#16A093' }}>← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const cta = computeCTA(competition, isRegistered, localRegistration, user);

  const tabs = [
    { key: 'about',   label: 'About Competition', content: competition.description[language] },
    { key: 'judging', label: 'Judging Parameters', content: competition.judgingParameters[language] },
    { key: 'rules',   label: 'Rules & Eligibility', content: competition.rulesAndEligibility[language] },
  ];

  const referralLink = user?.referralCode
    ? `https://feedants.com/r/${user.referralCode}`
    : 'https://feedants.com/r/referral123';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Fixed Header ───────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Go back</Text>
        </TouchableOpacity>
        <View style={styles.langToggle}>
          {(['en', 'hi'] as Language[]).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.langBtn, language === lang && styles.langBtnActive]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>
                {lang === 'en' ? 'ENG' : 'हिंदी'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Scrollable body ────────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Competition card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{competition.title}</Text>
            {isRegistered && (
              <View style={styles.registeredBadge}>
                <Text style={styles.registeredBadgeText}>✓ Registered</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {competition.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            <Text style={styles.certificate}>🏆 Winners get certificate</Text>
          </View>

          {/* Prize pool + entry fee + spots */}
          <View style={styles.prizesRow}>
            <View>
              <Text style={styles.priceLabel}>Prize Pool</Text>
              <Text style={styles.prizeValue}>₹ {competition.prizePool.toLocaleString('en-IN')}</Text>
            </View>
            <View>
              <Text style={styles.priceLabel}>Entry Fee</Text>
              <Text style={styles.entryValue}>₹ {competition.entryFee}</Text>
            </View>
            <SpotsProgress totalSpots={competition.totalSpots} bookedSpots={competition.bookedSpots} />
          </View>

          {/* ── Live Concurrency & Spot Booking Simulation (For Demo / Recording) ── */}
          <View style={styles.simBar}>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={handleSimulateBooking}
              disabled={simulating}
              activeOpacity={0.8}
            >
              <Text style={styles.simBtnText}>
                {simulating ? '⏳ Booking...' : '⚡ Simulate Live Spot Booking'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetSpots}
              activeOpacity={0.8}
            >
              <Text style={styles.resetBtnText}>🔄 Reset</Text>
            </TouchableOpacity>
          </View>

          {simulationToast && (
            <View style={styles.toastBox}>
              <Text style={styles.toastText}>{simulationToast}</Text>
            </View>
          )}
        </View>

        {/* Judge */}
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

        {/* Countdown */}
        <CountdownTimer
          targetDate={competition.registrationCloseDate}
          label="Registration closes in"
        />

        {/* Important dates */}
        <ImportantDates
          registerBefore={competition.registrationCloseDate}
          submissionStarts={competition.submissionStartDate}
          submissionEnds={competition.submissionEndDate}
          resultDate={competition.resultDate}
        />

        {/* Previous winners */}
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

        {/* About / Judging / Rules tabs */}
        <TabSection tabs={tabs} />

        {/* Rewards */}
        <RewardsList rewards={competition.rewards} />

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ℹ️{' '}
            <Text style={styles.bold}>Disclaimer:</Text>{' '}
            Only contributions from paid participants will be considered for judging.
          </Text>
        </View>

        {/* Prize money info */}
        <View style={styles.infoRow}>
          <TouchableOpacity
            style={styles.prizeInfoCard}
            onPress={() => Alert.alert('Prize Money', 'Prizes are transferred directly to your registered bank account within 7 business days of the result announcement.')}
          >
            <View style={styles.playCircle}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.prizeInfoTitle}>How will you receive prize money?</Text>
              <Text style={styles.prizeInfoSub}>Watch video to know more</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentRow}>
          <Text style={styles.paymentItem}>🛡 Refund policy</Text>
          <Text style={styles.paymentItem}>🛡 Secure payments powered by Razorpay</Text>
        </View>

        {/* Refer & Earn */}
        <View style={styles.referCard}>
          <Text style={styles.referTitle}>📣 Refer &amp; Earn more discount</Text>
          <View style={styles.referRow}>
            <View style={styles.referLinkBox}>
              <Text style={styles.referLink} numberOfLines={1}>{referralLink}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                  navigator.clipboard.writeText(referralLink);
                } else if (Clipboard?.setString) {
                  Clipboard.setString(referralLink);
                }
                Alert.alert('Copied!', 'Referral link copied to clipboard.');
              }}
            >
              <Text style={styles.copyBtnText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.referBottom}>
            <View style={styles.referNowBtn}>
              <Text style={styles.referNowText}>Refer Now</Text>
            </View>
            <Text style={styles.earnText}>You earn ₹10 for every signup</Text>
          </View>
        </View>

        {/* Hear from users */}
        <TouchableOpacity style={styles.hearCard}>
          <View>
            <Text style={styles.hearTitle}>💬 Hear From Our Users</Text>
            <Text style={styles.hearSub}>See what participants say about Feedants</Text>
          </View>
          <Text style={styles.hearArrow}>›</Text>
        </TouchableOpacity>

        {/* Ad placeholder */}
        <View style={styles.adBox}>
          <Text style={styles.adText}>📢 Ad Here</Text>
        </View>

        {/* Spacer for fixed bottom CTA */}
        <View style={{ height: 130 }} />
      </ScrollView>

      {/* ── Fixed bottom CTA ───────────────────────────────────────────────── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.ctaBtn, cta.disabled && styles.ctaBtnDisabled]}
          onPress={handleCTAPress}
          disabled={cta.disabled || registering}
          activeOpacity={0.85}
        >
          {registering
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.ctaText}>{cta.label}</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Bottom navigation ──────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home"         onPress={() => router.push('/')} />
        <NavItem icon="🔍" label="Explore" />
        <TouchableOpacity style={styles.navCenterBtn}>
          <Text style={styles.navCenterIcon}>+</Text>
        </TouchableOpacity>
        <NavItem icon="🏆" label="Competitions" active />
        <NavItem
          icon="👤"
          label="Profile"
          onPress={() => !user && router.push('/login')}
        />
      </View>

      {/* ── Video / Media Preview Modal ────────────────────────────────────── */}
      {videoModal.visible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>{videoModal.title}</Text>
              <TouchableOpacity
                onPress={() => setVideoModal({ visible: false, title: '', subtitle: '' })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{videoModal.subtitle}</Text>

            {/* Simulated interactive video player frame */}
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

function NavItem({
  icon, label, active, onPress,
}: {
  icon: string; label: string; active?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  loadingText: { marginTop: 14, fontSize: 14, color: '#888' },
  errorText:   { fontSize: 15, color: '#E05C2C', textAlign: 'center', marginBottom: 16 },
  retryBtn:    { backgroundColor: TEAL, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 8 },
  retryText:   { color: '#FFF', fontWeight: '700' },

  // ── Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EBEBEB',
  },
  backBtn:  {},
  backText: { fontSize: 16, color: '#1A1A1A', fontWeight: '600' },
  langToggle: { flexDirection: 'row', gap: 4 },
  langBtn: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: '#DDD',
  },
  langBtnActive:     { backgroundColor: TEAL, borderColor: TEAL },
  langBtnText:       { fontSize: 12, color: '#666', fontWeight: '600' },
  langBtnTextActive: { color: '#FFF' },

  scrollContent: { paddingBottom: 0 },

  // ── Competition card
  card: {
    backgroundColor: '#FFF', margin: 12, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#EBEBEB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
  },
  cardTitle:           { fontSize: 17, fontWeight: '800', color: '#1A1A1A', flex: 1, marginRight: 10 },
  registeredBadge:     { backgroundColor: '#E8F5F0', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#5CB85C' },
  registeredBadgeText: { fontSize: 12, color: '#3A9A3A', fontWeight: '700' },

  tagsRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  tag:         { backgroundColor: '#F0F0F0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  tagText:     { fontSize: 12, color: '#555', fontWeight: '500' },
  certificate: { fontSize: 12, color: TEAL, fontWeight: '600', alignSelf: 'center' },

  prizesRow:  {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12,
  },
  priceLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  prizeValue: { fontSize: 24, fontWeight: '900', color: TEAL },
  entryValue: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },

  // ── Disclaimer
  disclaimer: {
    marginHorizontal: 12, marginVertical: 6,
    backgroundColor: '#F8F8F8', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  disclaimerText: { fontSize: 13, color: '#555', lineHeight: 19 },
  bold:           { fontWeight: '800' },

  // ── Info rows
  infoRow: { marginHorizontal: 12, marginTop: 6 },
  prizeInfoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  playCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E8F5F4', alignItems: 'center', justifyContent: 'center',
  },
  playIcon:       { fontSize: 16, color: TEAL, marginLeft: 2 },
  prizeInfoTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  prizeInfoSub:   { fontSize: 12, color: '#888', marginTop: 2 },

  paymentRow: {
    marginHorizontal: 12, marginTop: 6, marginBottom: 4,
    backgroundColor: '#FFF', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#EBEBEB', gap: 6,
  },
  paymentItem: { fontSize: 13, color: '#555' },

  // ── Refer & Earn
  referCard: {
    marginHorizontal: 12, marginVertical: 6,
    backgroundColor: '#F0FAFA', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#C8ECEA',
  },
  referTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
  referRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  referLinkBox: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: '#D0E8E8',
  },
  referLink:    { fontSize: 12, color: '#555' },
  copyBtn:      {
    backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: TEAL,
  },
  copyBtnText:  { fontSize: 13, color: TEAL, fontWeight: '700' },
  referBottom:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  referNowBtn:  { backgroundColor: '#1A5C55', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  referNowText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  earnText:     { fontSize: 12, color: '#555' },

  // ── Hear from users
  hearCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 12, marginVertical: 6,
    backgroundColor: '#FFF', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  hearTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  hearSub:   { fontSize: 12, color: '#999', marginTop: 2 },
  hearArrow: { fontSize: 22, color: '#BBB' },

  // ── Ad
  adBox: {
    marginHorizontal: 12, marginVertical: 6,
    backgroundColor: '#F5F5F5', borderRadius: 10, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB',
  },
  adText: { fontSize: 13, color: '#CCC' },

  // ── CTA
  ctaWrap: {
    position: 'absolute', bottom: 60, left: 0, right: 0,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  ctaBtn: {
    backgroundColor: TEAL, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  ctaBtnDisabled: { backgroundColor: '#ABABAB' },
  ctaText:        { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // ── Bottom nav
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EBEBEB',
  },
  navItem:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon:      { fontSize: 20 },
  navIconActive:{ color: TEAL },
  navLabel:     { fontSize: 10, color: '#BBB', marginTop: 2 },
  navLabelActive:{ color: TEAL, fontWeight: '700' },
  navCenterBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center',
    marginTop: -20, elevation: 6,
    shadowColor: TEAL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 8,
  },
  navCenterIcon: { fontSize: 28, color: '#FFF', lineHeight: 32 },
  
  // ── Live Simulation & Toast
  simBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  simBtn: {
    flex: 1,
    backgroundColor: '#0F766E',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  simBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  resetBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  resetBtnText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  toastBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#6EE7B7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  toastText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '700',
  },

  // ── Video Preview Modal
  modalOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 9999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  modalClose: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '700',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  videoPlayerFrame: {
    height: 190,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  playPulseCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  videoPlayerIcon: {
    fontSize: 22,
    color: '#38BDF8',
    marginLeft: 3,
  },
  videoPlayerText: {
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  videoStreamDuration: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: '#334155',
  },
  progressFill: {
    width: '58%',
    height: '100%',
    backgroundColor: TEAL,
  },
  modalDoneBtn: {
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalDoneText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
