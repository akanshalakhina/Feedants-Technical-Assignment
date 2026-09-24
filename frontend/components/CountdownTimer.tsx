import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HourglassIcon, StopwatchIcon } from './Icons';

interface Props {
  targetDate: string;
  label?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function CountdownTimer({ targetDate, label = 'Registration closes in' }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) {
    return (
      <View style={styles.container}>
        <Text style={styles.expiredText}>Registration has closed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <HourglassIcon size={14} color="#00796B" style={{ marginRight: 5 }} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.timerRow}>
        <Text style={styles.timerText}>
          {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
        </Text>
      </View>
      <View style={styles.hurryBadge}>
        <StopwatchIcon size={14} color="#00796B" style={{ marginRight: 4 }} />
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F7F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginHorizontal: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#CBECE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  label: {
    fontSize: 11,
    color: '#0B1E3B',
    fontWeight: '700',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: TEAL,
    letterSpacing: -0.2,
  },
  hurryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hurryText: {
    fontSize: 11,
    color: TEAL,
    fontWeight: '700',
  },
  expiredText: {
    fontSize: 12,
    color: '#707E94',
    textAlign: 'center',
    padding: 2,
    fontWeight: '600',
  },
});
