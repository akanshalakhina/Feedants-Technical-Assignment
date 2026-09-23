import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  totalSpots: number;
  bookedSpots: number;
}

export function SpotsProgress({ totalSpots, bookedSpots }: Props) {
  const remaining = Math.max(0, totalSpots - bookedSpots);
  const progress  = totalSpots > 0 ? bookedSpots / totalSpots : 0;
  const isFull    = remaining === 0;
  const isUrgent  = !isFull && remaining <= 5;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isUrgent && styles.urgentLabel, isFull && styles.fullLabel]}>
        👥 {isFull ? 'Fully Booked' : `Only ${remaining} spot${remaining !== 1 ? 's' : ''} left`}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%` as `${number}%` },
            isUrgent && styles.urgentFill,
            isFull   && styles.fullFill,
          ]}
        />
      </View>
      <Text style={styles.booked}>
        {bookedSpots} / {totalSpots} Booked
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 8 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A093',
    marginBottom: 5,
  },
  urgentLabel: { color: '#E05C2C' },
  fullLabel:   { color: '#999' },
  track: {
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: '#16A093',
    borderRadius: 3,
  },
  urgentFill: { backgroundColor: '#E05C2C' },
  fullFill:   { backgroundColor: '#BBB' },
  booked: { fontSize: 10, color: '#999' },
});
