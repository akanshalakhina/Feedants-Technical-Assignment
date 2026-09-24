import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SpotsProgress } from './SpotsProgress';
import { TrophyIcon } from './Icons';

interface Props {
  title: string;
  tags: string[];
  isRegistered: boolean;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
}

export function CompetitionStats({
  title,
  tags,
  isRegistered,
  prizePool,
  entryFee,
  totalSpots,
  bookedSpots,
}: Props) {
  return (
    <View style={styles.topCard}>
      {/* Title & Registered badge row */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
        {isRegistered && (
          <View style={styles.registeredBadge}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>

      {/* Tags row */}
      <View style={styles.tagsRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <View style={styles.certRow}>
          <TrophyIcon size={14} color="#00796B" style={{ marginRight: 4 }} />
          <Text style={styles.certText}>Winners get certificate</Text>
        </View>
      </View>

      {/* Stats 3-column row */}
      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.prizePoolValue}>₹ {prizePool.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.entryFeeValue}>₹ {entryFee}</Text>
        </View>

        <View style={styles.spotsCol}>
          <SpotsProgress totalSpots={totalSpots} bookedSpots={bookedSpots} />
        </View>
      </View>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEEF0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B1E3B',
    flex: 1,
    letterSpacing: -0.3,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F5',
    borderWidth: 1,
    borderColor: '#A7E4DD',
    borderRadius: 18,
    paddingVertical: 3,
    paddingHorizontal: 8,
    gap: 4,
    flexShrink: 0,
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  registeredText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: TEAL,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certText: {
    fontSize: 11,
    color: TEAL,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  statCol: {
    minWidth: 75,
  },
  statLabel: {
    fontSize: 11,
    color: '#707E94',
    marginBottom: 4,
    fontWeight: '500',
  },
  prizePoolValue: {
    fontSize: 22,
    fontWeight: '800',
    color: TEAL,
    letterSpacing: -0.3,
  },
  entryFeeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B1E3B',
    letterSpacing: -0.3,
  },
  spotsCol: {
    alignItems: 'flex-end',
  },
});
