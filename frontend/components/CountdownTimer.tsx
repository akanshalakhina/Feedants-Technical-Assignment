import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
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
        <Text style={styles.expiredText}>⌛ Registration has closed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <Text style={styles.sandGlass}>⏳</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.timerRow}>
        <Text style={styles.timerText}>
          {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
        </Text>
      </View>
      <View style={styles.hurryBadge}>
        <Text style={styles.hurryIcon}>🔥</Text>
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F9F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#D2ECE9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sandGlass: {
    fontSize: 12,
  },
  label: {
    fontSize: 11,
    color: '#444444',
    fontWeight: '500',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEAL,
  },
  hurryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hurryIcon: {
    fontSize: 11,
  },
  hurryText: {
    fontSize: 11,
    color: TEAL,
    fontWeight: '700',
  },
  expiredText: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    padding: 4,
  },
});
