import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Reward } from '../services/api';

interface Props {
  rewards: Reward[];
}

const ICONS: Record<string, string> = {
  gold: '🏆',
  silver: '🥈',
  bronze: '🥉',
  star: '⭐',
};

export function RewardsList({ rewards }: Props) {
  if (!rewards.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.sub}>(All Positions)</Text>
      </View>
      <View style={styles.card}>
        {rewards.map((r, i) => (
          <View
            key={r.position}
            style={[styles.row, i < rewards.length - 1 && styles.borderBottom]}
          >
            <Text style={styles.icon}>{ICONS[r.icon] ?? '⭐'}</Text>
            <Text style={styles.label}>{r.label}</Text>
            <Text style={styles.amount}>₹ {r.amount.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  sub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  icon: {
    fontSize: 15,
    width: 22,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  amount: {
    fontSize: 13,
    fontWeight: '800',
    color: TEAL,
  },
});
