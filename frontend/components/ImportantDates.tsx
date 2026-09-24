import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarIcon, PlaneIcon, UploadIcon, TrophyIcon } from './Icons';

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
    <View style={styles.card}>
      <Text style={styles.title}>Important Dates</Text>
      <View style={styles.gridBox}>
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.borderRight, styles.borderBottom]}>
            <CalendarIcon size={16} color="#00796B" style={{ marginBottom: 4 }} />
            <Text style={styles.label}>Register Before</Text>
            <Text style={styles.date}>{rb.date}</Text>
            <Text style={styles.time}>{rb.time}</Text>
          </View>
          <View style={[styles.quadrant, styles.borderBottom]}>
            <PlaneIcon size={16} color="#00796B" style={{ marginBottom: 4 }} />
            <Text style={styles.label}>Submission Starts</Text>
            <Text style={styles.date}>{ss.date}</Text>
            <Text style={styles.time}>{ss.time}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.quadrant, styles.borderRight]}>
            <UploadIcon size={16} color="#00796B" style={{ marginBottom: 4 }} />
            <Text style={styles.label}>Submission Ends</Text>
            <Text style={styles.date}>{se.date}</Text>
            <Text style={styles.time}>{se.time}</Text>
          </View>
          <View style={styles.quadrant}>
            <TrophyIcon size={16} color="#00796B" style={{ marginBottom: 4 }} />
            <Text style={styles.label}>Result Date</Text>
            <Text style={styles.date}>{rd.date}</Text>
            <Text style={styles.time}>{rd.time}</Text>
          </View>
        </View>
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
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0B1E3B',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  gridBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#ECEEF2',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF2',
  },
  label: {
    fontSize: 11,
    color: '#707E94',
    marginBottom: 3,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    fontWeight: '800',
    color: TEAL,
    marginBottom: 1,
  },
  time: {
    fontSize: 13,
    color: '#0B1E3B',
    fontWeight: '800',
  },
});
