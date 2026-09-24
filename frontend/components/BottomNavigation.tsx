import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { HomeIcon, SearchIcon, TrophyIcon } from './Icons';

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
        <HomeIcon size={19} color={activeTab === 'home' ? '#00796B' : '#707E94'} />
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onExplorePress} activeOpacity={0.7}>
        <SearchIcon size={19} color={activeTab === 'explore' ? '#00796B' : '#707E94'} />
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navCenterBtn} onPress={onCenterPress} activeOpacity={0.85}>
        <View style={styles.navCenterSquircle}>
          <View style={styles.navCenterWhiteCircle}>
            <Text style={styles.navCenterPlus}>+</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onCompetitionsPress} activeOpacity={0.7}>
        <TrophyIcon size={19} color={activeTab === 'competitions' ? '#00796B' : '#707E94'} />
        <Text style={[styles.navLabel, activeTab === 'competitions' && styles.navLabelActive]}>
          Competitions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onProfilePress} activeOpacity={0.7}>
        <Image
          source={require('../assets/images/profile_avatar.png')}
          style={styles.profileAvatar}
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const TEAL = '#00796B';

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
    minWidth: 55,
  },
  navLabel: {
    fontSize: 10,
    color: '#707E94',
    marginTop: 3,
    fontWeight: '500',
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: '700',
  },
  navCenterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCenterSquircle: {
    width: 44,
    height: 34,
    borderRadius: 10,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCenterWhiteCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCenterPlus: {
    color: TEAL,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 16,
    marginLeft: 0.5,
  },
  profileAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
});
