import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Clipboard } from 'react-native';
import { ShieldCheckIcon, MegaphoneIcon } from './Icons';

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
            <ShieldCheckIcon size={14} color="#0B1E3B" style={{ marginRight: 5 }} />
            <Text style={styles.trustText}>Refund policy</Text>
          </View>
          <View style={styles.trustItem}>
            <ShieldCheckIcon size={14} color="#0B1E3B" style={{ marginRight: 5 }} />
            <Text style={styles.trustSubText}>
              Secure payments powered by{' '}
              <Text style={styles.razorpayBrand}>Razorpay</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Refer & Earn Card */}
      <View style={styles.referCard}>
        {/* Left megaphone icon */}
        <View style={styles.megaphoneWrap}>
          <MegaphoneIcon size={28} color="#10B981" />
        </View>

        {/* Center column: Header & connected input */}
        <View style={styles.referCenterCol}>
          <Text style={styles.referTitle}>Refer &amp; Earn more discount</Text>
          <View style={styles.linkGroup}>
            <View style={styles.linkInput}>
              <Text style={styles.linkText} numberOfLines={1}>
                {referralLink}
              </Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
              <Text style={styles.copyBtnText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right column: Refer Now CTA and earn subtext */}
        <View style={styles.referRightCol}>
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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#CBECE6',
  },
  disclaimerText: {
    fontSize: 11.5,
    color: '#0B1E3B',
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
    flex: 1.15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 6,
  },
  playBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#D5EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: TEAL,
    fontSize: 14,
    marginLeft: 2,
  },
  faqInfo: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0B1E3B',
    lineHeight: 15,
  },
  faqSub: {
    fontSize: 10,
    color: '#707E94',
    marginTop: 2,
  },
  vertDivider: {
    width: 1,
    height: 42,
    backgroundColor: '#ECEEF2',
    marginHorizontal: 4,
  },
  colRight: {
    flex: 1,
    gap: 5,
    paddingLeft: 4,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0B1E3B',
  },
  trustSubText: {
    fontSize: 10,
    color: '#0B1E3B',
    lineHeight: 14,
  },
  razorpayBrand: {
    fontWeight: '900',
    color: '#0C2340',
    fontStyle: 'italic',
  },
  referCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF9F4',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBEEDB',
    marginBottom: 6,
  },
  megaphoneWrap: {
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referCenterCol: {
    flex: 1,
    marginRight: 6,
  },
  referTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B1E3B',
    marginBottom: 5,
  },
  linkGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B2DFDB',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  linkText: {
    fontSize: 10,
    color: TEAL,
    fontWeight: '600',
  },
  copyBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#B2DFDB',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  copyBtnText: {
    fontSize: 10,
    color: TEAL,
    fontWeight: '700',
  },
  referRightCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 85,
  },
  referBtn: {
    backgroundColor: TEAL,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    width: '100%',
    alignItems: 'center',
  },
  referBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  earnLabel: {
    fontSize: 9,
    color: TEAL,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  earnHighlight: {
    color: TEAL,
    fontWeight: '800',
  },
});
