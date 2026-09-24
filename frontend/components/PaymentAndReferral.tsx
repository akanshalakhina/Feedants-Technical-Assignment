import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Clipboard } from 'react-native';

interface Props {
  referralCode?: string;
  onPrizeInfoPress: () => void;
}

export function PaymentAndReferral({ referralCode, onPrizeInfoPress }: Props) {
  const referralLink = referralCode
    ? `https://feedants.com/r/${referralCode}`
    : 'https://feedants.com/r/referral123';

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(referralLink);
    } else if (Clipboard?.setString) {
      Clipboard.setString(referralLink);
    }
    Alert.alert('Copied!', 'Referral link copied to clipboard.');
  };

  return (
    <View style={styles.container}>
      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          <Text style={styles.infoIcon}>ⓘ </Text>
          <Text style={styles.boldTeal}>Disclaimer: </Text>
          Only contributions from paid participants will be considered for judging.
        </Text>
      </View>

      {/* Prize Money FAQ & Payment Security Card (Two Columns) */}
      <View style={styles.twoColCard}>
        {/* Left column: Video FAQ */}
        <TouchableOpacity
          style={styles.colLeft}
          onPress={onPrizeInfoPress}
          activeOpacity={0.8}
        >
          <View style={styles.playBox}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <View style={styles.faqInfo}>
            <Text style={styles.faqTitle}>How will you receive prize money?</Text>
            <Text style={styles.faqSub}>Watch video to know more</Text>
          </View>
        </TouchableOpacity>

        {/* Vertical hairline divider */}
        <View style={styles.vertDivider} />

        {/* Right column: Trust & Razorpay */}
        <View style={styles.colRight}>
          <View style={styles.trustItem}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <Text style={styles.trustText}>Refund policy</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <Text style={styles.trustSubText}>
              Secure payments powered by{' '}
              <Text style={styles.razorpayBrand}>Razorpay</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Refer & Earn Card */}
      <View style={styles.referCard}>
        <View style={styles.referTopRow}>
          <Text style={styles.megaphoneIcon}>📢</Text>
          <Text style={styles.referTitle}>Refer &amp; Earn more discount</Text>
        </View>

        <View style={styles.linkRow}>
          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>
              {referralLink}
            </Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
            <Text style={styles.copyBtnText}>Copy Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.referActionRow}>
          <TouchableOpacity
            style={styles.referBtn}
            onPress={() => Alert.alert('Refer Now', `Share this referral link with your peers:\n${referralLink}`)}
            activeOpacity={0.85}
          >
            <Text style={styles.referBtnText}>Refer Now</Text>
          </TouchableOpacity>
          <Text style={styles.earnLabel}>
            You earn <Text style={styles.earnHighlight}>₹10</Text> for every signup
          </Text>
        </View>
      </View>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  disclaimer: {
    backgroundColor: '#E6F7F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C5ECE6',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#111827',
    lineHeight: 16,
  },
  infoIcon: {
    color: TEAL,
    fontWeight: '800',
  },
  boldTeal: {
    fontWeight: '800',
    color: TEAL,
  },
  twoColCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    padding: 10,
    marginBottom: 8,
  },
  colLeft: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 6,
  },
  playBox: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: TEAL,
    fontSize: 12,
    marginLeft: 1,
  },
  faqInfo: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 14,
  },
  faqSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  vertDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ECEEF0',
    marginHorizontal: 6,
  },
  colRight: {
    flex: 1,
    gap: 4,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shieldIcon: {
    fontSize: 11,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  trustSubText: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
  },
  razorpayBrand: {
    fontWeight: '900',
    color: '#0C2340',
    fontStyle: 'italic',
  },
  referCard: {
    backgroundColor: '#E6F7F5',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C5ECE6',
    marginBottom: 6,
  },
  referTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  megaphoneIcon: {
    fontSize: 14,
  },
  referTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  linkBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C5ECE6',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 10,
    color: '#6B7280',
  },
  copyBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C5ECE6',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  copyBtnText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '600',
  },
  referActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  referBtn: {
    backgroundColor: '#006064',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  referBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  earnLabel: {
    fontSize: 11,
    color: '#4B5563',
  },
  earnHighlight: {
    color: TEAL,
    fontWeight: '700',
  },
});
