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

interface ItemProps {
  icon:  string;
  label: string;
  date:  string;
  time:  string;
}

function DateItem({ icon, label, date, time }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

export function ImportantDates({ registerBefore, submissionStarts, submissionEnds, resultDate }: Props) {
  const rb = formatDate(registerBefore);
  const ss = formatDate(submissionStarts);
  const se = formatDate(submissionEnds);
  const rd = formatDate(resultDate);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Important Dates</Text>
      <View style={styles.grid}>
        <DateItem icon="📅" label="Register Before"   date={rb.date} time={rb.time} />
        <DateItem icon="✈️" label="Submission Starts" date={ss.date} time={ss.time} />
        <DateItem icon="⬆️" label="Submission Ends"   date={se.date} time={se.time} />
        <DateItem icon="🏆" label="Result Date"       date={rd.date} time={rd.time} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 12, marginVertical: 8 },
  title:   { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  item: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 12,
  },
  icon:  { fontSize: 20, marginBottom: 4 },
  label: { fontSize: 11, color: '#999', marginBottom: 4 },
  date:  { fontSize: 14, fontWeight: '800', color: '#16A093', marginBottom: 2 },
  time:  { fontSize: 12, color: '#555' },
});
