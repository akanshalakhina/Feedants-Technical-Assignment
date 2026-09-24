import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UsersIcon } from './Icons';

interface Props {
  totalSpots: number;
  bookedSpots: number;
}

export function SpotsProgress({ totalSpots, bookedSpots }: Props) {
  const remaining = Math.max(0, totalSpots - bookedSpots);
  const progress = totalSpots > 0 ? bookedSpots / totalSpots : 0;
  const isFull = remaining === 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <UsersIcon size={14} color="#00796B" style={{ marginRight: 4 }} />
        <Text style={styles.label}>
          {isFull ? 'Fully Booked' : `Only ${remaining} spots left`}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(100, Math.max(5, progress * 100))}%` as `${number}%` },
          ]}
        />
      </View>
      <Text style={styles.booked}>
        {bookedSpots} / {totalSpots} Booked
      </Text>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  container: {
    minWidth: 110,
    alignItems: 'flex-start',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
  },
  track: {
    width: 110,
    height: 4.5,
    backgroundColor: '#DCF2EE',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 3,
  },
  booked: {
    fontSize: 11,
    color: '#707E94',
    fontWeight: '500',
  },
});
