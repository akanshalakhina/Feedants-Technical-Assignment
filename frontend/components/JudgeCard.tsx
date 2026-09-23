import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Judge {
  name: string;
  title: string;
  experience: string;
  photoUrl: string;
  introVideoUrl: string;
}

interface Props {
  judge: Judge;
  onVideoPress?: () => void;
}

export function JudgeCard({ judge, onVideoPress }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: judge.photoUrl }}
        style={styles.avatar}
        defaultSource={{ uri: 'https://via.placeholder.com/60' }}
      />
      <View style={styles.info}>
        <Text style={styles.judgeLabel}>Judge</Text>
        <Text style={styles.name}>{judge.name}</Text>
        <Text style={styles.detail}>{judge.title}</Text>
        <Text style={styles.detail}>{judge.experience}</Text>
      </View>
      <TouchableOpacity style={styles.videoBtn} onPress={onVideoPress} activeOpacity={0.7}>
        <View style={styles.playCircle}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <Text style={styles.videoLabel}>Intro Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEE',
  },
  info: { flex: 1 },
  judgeLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  name:        { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  detail:      { fontSize: 12, color: '#666', marginTop: 1 },
  videoBtn:    { alignItems: 'center', gap: 6 },
  playCircle:  {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#16A093',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon:  { color: '#16A093', fontSize: 15, marginLeft: 2 },
  videoLabel:{ fontSize: 11, color: '#666' },
});
