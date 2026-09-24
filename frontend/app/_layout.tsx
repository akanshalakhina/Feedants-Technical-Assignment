import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  useWindowDimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';

function MobileStatusBar() {
  return (
    <View style={styles.statusBarContainer}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        {/* Signal Bars */}
        <View style={styles.signalGroup}>
          <View style={[styles.signalBar, { height: 4 }]} />
          <View style={[styles.signalBar, { height: 6 }]} />
          <View style={[styles.signalBar, { height: 8 }]} />
          <View style={[styles.signalBar, { height: 10 }]} />
        </View>

        {/* Wifi Icon */}
        <View style={styles.wifiContainer}>
          <Text style={styles.wifiText}>🛜</Text>
        </View>

        {/* Battery Icon */}
        <View style={styles.batteryContainer}>
          <View style={styles.batteryBody}>
            <View style={styles.batteryLevel} />
          </View>
          <View style={styles.batteryCap} />
        </View>
      </View>
    </View>
  );
}

function LayoutContent() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 480;

  return (
    <View style={[styles.outerContainer, isDesktopWeb && styles.desktopOuter]}>
      <View style={[styles.appFrame, isDesktopWeb && styles.desktopFrame]}>
        {isDesktopWeb && <MobileStatusBar />}
        <View style={styles.stackWrapper}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <LayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  desktopOuter: {
    backgroundColor: '#0B132B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  appFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  desktopFrame: {
    maxWidth: 390,
    width: 390,
    height: 844,
    maxHeight: '96vh' as unknown as number,
    borderRadius: 36,
    borderWidth: 7,
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  statusBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
    height: 10,
    marginRight: 2,
  },
  signalBar: {
    width: 2.5,
    backgroundColor: '#000000',
    borderRadius: 0.5,
  },
  wifiContainer: {
    marginRight: 2,
  },
  wifiText: {
    fontSize: 12,
    color: '#000000',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    width: 21,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.2,
    borderColor: '#000000',
    padding: 1.5,
    justifyContent: 'center',
  },
  batteryLevel: {
    height: '100%',
    width: '75%',
    backgroundColor: '#000000',
    borderRadius: 1.5,
  },
  batteryCap: {
    width: 1.5,
    height: 4,
    backgroundColor: '#000000',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  stackWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8F9FA',
  },
});
