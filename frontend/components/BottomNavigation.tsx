import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface Props {
  activeTab?: string;
  onHomePress: () => void;
  onExplorePress?: () => void;
  onCenterPress?: () => void;
  onCompetitionsPress?: () => void;
  onProfilePress?: () => void;
}

export function BottomNavigation({
  activeTab = 'competitions',
  onHomePress,
  onExplorePress,
  onCenterPress,
  onCompetitionsPress,
  onProfilePress,
}: Props) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={onHomePress} activeOpacity={0.7}>
        <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onExplorePress} activeOpacity={0.7}>
        <Text style={[styles.navIcon, activeTab === 'explore' && styles.navIconActive]}>🔍</Text>
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navCenterBtn} onPress={onCenterPress} activeOpacity={0.85}>
        <Text style={styles.navCenterIcon}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onCompetitionsPress} activeOpacity={0.7}>
        <Text style={[styles.navIcon, activeTab === 'competitions' && styles.navIconActive]}>🏆</Text>
        <Text style={[styles.navLabel, activeTab === 'competitions' && styles.navLabelActive]}>
          Competitions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onProfilePress} activeOpacity={0.7}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }}
          style={styles.profileAvatar}
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const TEAL = '#005953';

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEEF0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 2,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 50,
  },
  navIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  navIconActive: {
    color: TEAL,
  },
  navLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: '800',
  },
  navCenterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navCenterIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  profileAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F3F4F6',
  },
});
