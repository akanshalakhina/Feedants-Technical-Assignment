import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Reward } from '../services/api';

interface Props {
  rewards: Reward[];
}

const ICONS: Record<string, string> = {
  gold:   '🏆',
  silver: '🥈',
  bronze: '🥉',
  star:   '⭐',
};

export function RewardsList({ rewards }: Props) {
  if (!rewards.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.sub}>(All Positions)</Text>
      </View>
      {rewards.map((r) => (
        <View key={r.position} style={styles.row}>
          <Text style={styles.icon}>{ICONS[r.icon] ?? '⭐'}</Text>
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.amount}>₹ {r.amount.toLocaleString('en-IN')}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 12, marginVertical: 8 },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  title:   { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  sub:     { fontSize: 13, color: '#888' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 10,
  },
  icon:   { fontSize: 18, width: 26, textAlign: 'center' },
  label:  { flex: 1, fontSize: 13, color: '#333333', fontWeight: '500' },
  amount: { fontSize: 14, fontWeight: '800', color: '#16A093' },
});
