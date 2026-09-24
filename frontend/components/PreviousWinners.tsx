import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PreviousWinner } from '../services/api';

interface Props {
  winners: PreviousWinner[];
  onVideoPress?: (winner: PreviousWinner) => void;
}

const LOCAL_WINNER_IMAGES = [
  require('../assets/images/winner_riya.png'),
  require('../assets/images/winner_aarav.png'),
  require('../assets/images/winner_neha.png'),
  require('../assets/images/winner_ishita.png'),
];

export function PreviousWinners({ winners, onVideoPress }: Props) {
  if (!winners.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previous Winners</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {winners.map((winner, i) => {
          const imgSource = LOCAL_WINNER_IMAGES[i] || { uri: winner.videoThumbnailUrl };
          return (
            <TouchableOpacity
              key={i}
              style={styles.winnerCard}
              onPress={() => onVideoPress?.(winner)}
              activeOpacity={0.8}
            >
              <View style={styles.thumbWrap}>
                <Image source={imgSource} style={styles.thumb} />
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
          );
        })}
      </ScrollView>
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
  scroll: {
    gap: 8,
    paddingRight: 4,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    padding: 4,
    paddingRight: 12,
    gap: 10,
  },
  thumbWrap: {
    width: 54,
    height: 54,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0B1E3B',
  },
  rank: {
    fontSize: 11,
    color: TEAL,
    fontWeight: '600',
    marginTop: 2,
  },
});
