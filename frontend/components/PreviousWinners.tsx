import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PreviousWinner } from '../services/api';

interface Props {
  winners: PreviousWinner[];
  onVideoPress?: (winner: PreviousWinner) => void;
}

export function PreviousWinners({ winners, onVideoPress }: Props) {
  if (!winners.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Previous Winners</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {winners.map((winner, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() => onVideoPress?.(winner)}
            activeOpacity={0.8}
          >
            <View style={styles.thumbWrap}>
              <Image source={{ uri: winner.videoThumbnailUrl }} style={styles.thumb} />
              <View style={styles.overlay}>
                <View style={styles.playBtn}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.name} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.rank}>
                {winner.rank} Winner
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  section: {
    marginVertical: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    padding: 4,
    paddingRight: 10,
    gap: 8,
  },
  thumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 9,
    color: TEAL,
    marginLeft: 2,
  },
  infoCol: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  rank: {
    fontSize: 11,
    color: TEAL,
    fontWeight: '600',
    marginTop: 2,
  },
});
