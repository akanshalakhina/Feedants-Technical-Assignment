import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PreviousWinner } from '../services/api';

interface Props {
  winners: PreviousWinner[];
  onVideoPress?: (winner: PreviousWinner) => void;
}

const RANK_COLOR: Record<string, string> = {
  '1st': '#D4A72E',
  '2nd': '#8E9BA8',
  '3rd': '#B56A2E',
};

export function PreviousWinners({ winners, onVideoPress }: Props) {
  if (!winners.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Previous Winners</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {winners.map((winner, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => onVideoPress?.(winner)} activeOpacity={0.8}>
            <View style={styles.thumbWrap}>
              <Image source={{ uri: winner.videoThumbnailUrl }} style={styles.thumb} />
              <View style={styles.overlay}>
                <View style={styles.playBtn}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
            </View>
            <Text style={styles.name} numberOfLines={1}>{winner.name}</Text>
            <Text style={[styles.rank, { color: RANK_COLOR[winner.rank] ?? '#888' }]}>
              {winner.rank} Winner
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section:  { marginVertical: 8 },
  title:    { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginHorizontal: 12, marginBottom: 10 },
  scroll:   { paddingHorizontal: 12, gap: 12 },
  card:     { width: 100 },
  thumbWrap:{ width: 100, height: 100, borderRadius: 10, overflow: 'hidden', backgroundColor: '#EEE' },
  thumb:    { width: '100%', height: '100%' },
  overlay:  {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  playBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { fontSize: 13, color: '#333', marginLeft: 2 },
  name:     { fontSize: 12, fontWeight: '700', color: '#1A1A1A', marginTop: 6 },
  rank:     { fontSize: 11, marginTop: 1 },
});
