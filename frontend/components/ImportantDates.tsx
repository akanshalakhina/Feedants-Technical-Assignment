import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  registerBefore: string;
  submissionStarts: string;
  submissionEnds: string;
  resultDate: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString('en-IN', { month: 'short' });
  const year = d.getFullYear().toString().slice(-2);
  const time = d.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  return { date: `${day} ${month} ${year}`, time };
}

export function ImportantDates({ registerBefore, submissionStarts, submissionEnds, resultDate }: Props) {
  const rb = formatDate(registerBefore);
  const ss = formatDate(submissionStarts);
  const se = formatDate(submissionEnds);
  const rd = formatDate(resultDate);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Important Dates</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.borderRight, styles.borderBottom]}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.label}>Register Before</Text>
            <Text style={styles.date}>{rb.date}</Text>
            <Text style={styles.time}>{rb.time}</Text>
          </View>
          <View style={[styles.quadrant, styles.borderBottom]}>
            <Text style={styles.icon}>✈️</Text>
            <Text style={styles.label}>Submission Starts</Text>
            <Text style={styles.date}>{ss.date}</Text>
            <Text style={styles.time}>{ss.time}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.borderRight]}>
            <Text style={styles.icon}>⬆️</Text>
            <Text style={styles.label}>Submission Ends</Text>
            <Text style={styles.date}>{se.date}</Text>
            <Text style={styles.time}>{se.time}</Text>
          </View>
          <View style={styles.quadrant}>
            <Text style={styles.icon}>🏆</Text>
            <Text style={styles.label}>Result Date</Text>
            <Text style={styles.date}>{rd.date}</Text>
            <Text style={styles.time}>{rd.time}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  icon: {
    fontSize: 15,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 1,
  },
  time: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});
