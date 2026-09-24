import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
      <TouchableOpacity
        style={styles.navItem}
        onPress={onHomePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onExplorePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'explore' && styles.navIconActive]}>🔍</Text>
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navCenterBtn}
        onPress={onCenterPress}
        activeOpacity={0.85}
      >
        <Text style={styles.navCenterIcon}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onCompetitionsPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'competitions' && styles.navIconActive]}>🏆</Text>
        <Text style={[styles.navLabel, activeTab === 'competitions' && styles.navLabelActive]}>
          Competitions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.navIcon, activeTab === 'profile' && styles.navIconActive]}>👤</Text>
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 58,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 2,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 50,
  },
  navIcon: {
    fontSize: 18,
    color: '#94A3B8',
  },
  navIconActive: {
    color: TEAL,
  },
  navLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: '700',
  },
  navCenterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navCenterIcon: {
    color: '#FFF',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
});
