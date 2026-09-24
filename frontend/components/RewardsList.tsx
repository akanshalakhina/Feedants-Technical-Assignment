import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Reward } from '../services/api';
import { StarOutlineIcon } from './Icons';

interface Props {
  rewards: Reward[];
}

export function RewardsList({ rewards }: Props) {
  if (!rewards.length) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.sub}>(All Positions)</Text>
      </View>
      <View style={styles.list}>
        {rewards.map((r) => {
          const isStar = r.icon === 'star';
          return (
            <View key={r.position} style={styles.row}>
              <View style={styles.iconWrap}>
                {isStar ? (
                  <StarOutlineIcon size={16} color="#00796B" />
                ) : r.icon === 'gold' ? (
                  <Text style={styles.emojiIcon}>🏆</Text>
                ) : r.icon === 'silver' ? (
                  <Text style={styles.emojiIcon}>🥈</Text>
                ) : (
                  <Text style={styles.emojiIcon}>🥉</Text>
                )}
              </View>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.amount}>₹ {r.amount.toLocaleString('en-IN')}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0B1E3B',
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 12.5,
    color: '#707E94',
    fontWeight: '500',
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconWrap: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  emojiIcon: {
    fontSize: 15,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: '#0B1E3B',
    fontWeight: '700',
  },
  amount: {
    fontSize: 15.5,
    fontWeight: '800',
    color: TEAL,
    letterSpacing: -0.2,
  },
});
