import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
      <Text style={styles.label}>
        👥 {isFull ? 'Fully Booked' : `Only ${remaining} spots left`}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.max(5, progress * 100)}%` as `${number}%` },
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
    minWidth: 120,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
    marginBottom: 5,
  },
  track: {
    width: '100%',
    height: 3,
    backgroundColor: '#D7F0EC',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  booked: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
});
