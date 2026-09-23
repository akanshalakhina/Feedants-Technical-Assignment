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
      <Text style={styles.label}>⌛ {label}</Text>
      <View style={styles.timerRow}>
        <TimeUnit value={pad(timeLeft.days)} unit="d" />
        <Text style={styles.colon}>:</Text>
        <TimeUnit value={pad(timeLeft.hours)} unit="h" />
        <Text style={styles.colon}>:</Text>
        <TimeUnit value={pad(timeLeft.minutes)} unit="m" />
        <Text style={styles.colon}>:</Text>
        <TimeUnit value={pad(timeLeft.seconds)} unit="s" />
        <Text style={styles.hurry}>🕐 Hurry up!</Text>
      </View>
    </View>
  );
}

function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <View>
      <Text style={styles.digit}>
        {value}
        <Text style={styles.unit}>{unit}</Text>
      </Text>
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FAFA',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#C8ECEA',
  },
  label: { fontSize: 13, color: '#444', fontWeight: '500', marginBottom: 8 },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  digit: { fontSize: 18, fontWeight: '800', color: TEAL },
  unit:  { fontSize: 12, fontWeight: '500', color: TEAL },
  colon: { fontSize: 18, fontWeight: '800', color: TEAL },
  hurry: { fontSize: 13, color: TEAL, fontWeight: '600', marginLeft: 8 },
  expiredText: { fontSize: 14, color: '#888', textAlign: 'center' },
});
