import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';

function MobileStatusBar() {
  return (
    <View style={styles.statusBarContainer}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        <Text style={styles.statusIconText}>📶</Text>
        <Text style={styles.statusIconText}>🛜</Text>
        <Text style={styles.statusIconText}>🔋</Text>
      </View>
    </View>
  );
}

function LayoutContent() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 520;

  return (
    <View style={[styles.outerContainer, isDesktopWeb && styles.desktopOuter]}>
      <View style={[styles.appFrame, isDesktopWeb && styles.desktopFrame]}>
        <MobileStatusBar />
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

const TEAL = '#16A093';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  desktopOuter: {
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  appFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  desktopFrame: {
    maxWidth: 412,
    width: '100%',
    height: 870,
    maxHeight: '96vh' as unknown as number,
    borderRadius: 36,
    borderWidth: 10,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  statusBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIconText: {
    fontSize: 12,
  },
  stackWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8F9FA',
  },
});
