import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SpotsProgress } from './SpotsProgress';

interface Props {
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  simulating: boolean;
  simulationToast: string | null;
  onSimulateBooking: () => void;
  onResetSpots: () => void;
}

export function CompetitionStats({
  prizePool,
  entryFee,
  totalSpots,
  bookedSpots,
  simulating,
  simulationToast,
  onSimulateBooking,
  onResetSpots,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Financials and spots row */}
      <View style={styles.prizesRow}>
        <View style={styles.statCol}>
          <Text style={styles.priceLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>₹ {prizePool.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.statCol}>
          <Text style={styles.priceLabel}>Entry Fee</Text>
          <Text style={styles.entryValue}>₹ {entryFee}</Text>
        </View>

        <View style={styles.spotsCol}>
          <SpotsProgress totalSpots={totalSpots} bookedSpots={bookedSpots} />
        </View>
      </View>

      {/* Live concurrency simulation bar for demo and evaluators */}
      <View style={styles.simBar}>
        <TouchableOpacity
          style={styles.simBtn}
          onPress={onSimulateBooking}
          disabled={simulating}
          activeOpacity={0.8}
        >
          <Text style={styles.simBtnText}>
            {simulating ? '⏳ Booking Spot...' : '⚡ Simulate Live Spot Booking'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetSpots} activeOpacity={0.8}>
          <Text style={styles.resetBtnText}>🔄 Reset</Text>
        </TouchableOpacity>
      </View>

      {simulationToast && (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>{simulationToast}</Text>
        </View>
      )}
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  prizesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCol: {
    marginRight: 16,
  },
  priceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
    fontWeight: '500',
  },
  prizeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  entryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  spotsCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  simBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  simBtn: {
    flex: 1,
    backgroundColor: '#F0F9F8',
    borderWidth: 1,
    borderColor: '#94DCD4',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
  },
  resetBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  toastBox: {
    marginTop: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  toastText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
});
