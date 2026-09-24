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
          ℹ️ <Text style={styles.bold}>Disclaimer:</Text> Only contributions from paid participants
          will be considered for judging.
        </Text>
      </View>

      {/* Prize money information video card */}
      <TouchableOpacity
        style={styles.prizeInfoCard}
        onPress={onPrizeInfoPress}
        activeOpacity={0.8}
      >
        <View style={styles.playCircle}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.prizeInfoTextCol}>
          <Text style={styles.prizeInfoTitle}>How will you receive prize money?</Text>
          <Text style={styles.prizeInfoSub}>Watch video to know more</Text>
        </View>
      </TouchableOpacity>

      {/* Trust badges */}
      <View style={styles.paymentRow}>
        <Text style={styles.paymentItem}>🛡 Refund policy</Text>
        <Text style={styles.paymentItem}>🛡 Secure payments powered by Razorpay</Text>
      </View>

      {/* Refer & Earn Card */}
      <View style={styles.referCard}>
        <Text style={styles.referTitle}>📣 Refer &amp; Earn more discount</Text>
        <View style={styles.referRow}>
          <View style={styles.referLinkBox}>
            <Text style={styles.referLink} numberOfLines={1}>
              {referralLink}
            </Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
            <Text style={styles.copyBtnText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.referBottom}>
          <TouchableOpacity
            style={styles.referNowBtn}
            onPress={() => Alert.alert('Refer Now', `Share this link with your friends:\n${referralLink}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.referNowText}>Refer Now</Text>
          </TouchableOpacity>
          <Text style={styles.earnText}>You earn ₹10 for every signup</Text>
        </View>
      </View>
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  disclaimer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
  },
  bold: {
    fontWeight: '700',
    color: '#333333',
  },
  prizeInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 8,
    gap: 12,
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F7F5',
    borderWidth: 1.5,
    borderColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: TEAL,
    fontSize: 14,
    marginLeft: 2,
  },
  prizeInfoTextCol: {
    flex: 1,
  },
  prizeInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  prizeInfoSub: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 6,
    marginBottom: 8,
  },
  paymentItem: {
    fontSize: 11,
    color: '#888888',
  },
  referCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 8,
  },
  referTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  referRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  referLinkBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  referLink: {
    fontSize: 11,
    color: '#64748B',
  },
  copyBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  copyBtnText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  referBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  referNowBtn: {
    backgroundColor: TEAL,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  referNowText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
  earnText: {
    fontSize: 11,
    color: '#64748B',
  },
});
