import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  registerBefore:   string;
  submissionStarts: string;
  submissionEnds:   string;
  resultDate:       string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const day   = d.getDate();
  const month = d.toLocaleString('en-IN', { month: 'short' });
  const year  = d.getFullYear().toString().slice(-2);
  const time  = d.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
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
            <Text style={styles.icon}>🚀</Text>
            <Text style={styles.label}>Submission Starts</Text>
            <Text style={styles.date}>{ss.date}</Text>
            <Text style={styles.time}>{ss.time}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.borderRight]}>
            <Text style={styles.icon}>📤</Text>
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
  section: { marginHorizontal: 12, marginVertical: 6 },
  title:   { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    padding: 12,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  icon:  { fontSize: 16, marginBottom: 4 },
  label: { fontSize: 11, color: '#888888', marginBottom: 2 },
  date:  { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  time:  { fontSize: 11, color: '#666666' },
});
