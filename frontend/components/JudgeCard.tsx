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

const TEAL = '#00796B';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
  },
  judgeLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '500',
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  detail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  videoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: TEAL,
    fontSize: 13,
    marginLeft: 2,
  },
  videoLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
});
