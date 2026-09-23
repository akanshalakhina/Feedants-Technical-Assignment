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

function DemoToolbar() {
  const { user, login, logout } = useAuth();

  return (
    <View style={styles.toolbar}>
      <View style={styles.toolbarLeft}>
        <View style={styles.toolbarBadge}>
          <Text style={styles.toolbarBadgeText}>LIVE DEMO</Text>
        </View>
        <Text style={styles.toolbarUser} numberOfLines={1}>
          {user ? `👤 ${user.name}` : '👤 Guest (Unregistered)'}
        </Text>
      </View>
      <View style={styles.toolbarButtons}>
        <TouchableOpacity
          style={[styles.toolBtn, !user && styles.toolBtnActive]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text style={[styles.toolBtnText, !user && styles.toolBtnTextActive]}>Guest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolBtn, user?.email === 'arjun@example.com' && styles.toolBtnActive]}
          onPress={() => login('arjun@example.com', 'password123')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toolBtnText, user?.email === 'arjun@example.com' && styles.toolBtnTextActive]}>
            Arjun (Reg)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolBtn, user?.email === 'priya@example.com' && styles.toolBtnActive]}
          onPress={() => login('priya@example.com', 'password456')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toolBtnText, user?.email === 'priya@example.com' && styles.toolBtnTextActive]}>
            Priya (Unreg)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LayoutContent() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 520;

  return (
    <View style={[styles.outerContainer, isDesktopWeb && styles.desktopOuter]}>
      {isDesktopWeb && (
        <View style={styles.desktopHeaderNotice}>
          <Text style={styles.desktopNoticeTitle}>🎭 Feedants App — Native Mobile Simulator</Text>
          <Text style={styles.desktopNoticeSub}>
            Dynamic Full Stack Feature • MongoDB Real-time Sync • Click demo users above to switch states
          </Text>
        </View>
      )}

      <View style={[styles.appFrame, isDesktopWeb && styles.desktopFrame]}>
        <DemoToolbar />
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
    justifyContent: 'flex-start',
    paddingVertical: 16,
    overflow: 'auto' as unknown as undefined,
  },
  desktopHeaderNotice: {
    marginBottom: 12,
    alignItems: 'center',
  },
  desktopNoticeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  desktopNoticeSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  appFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  desktopFrame: {
    maxWidth: 450,
    width: '100%',
    height: 880,
    maxHeight: '92vh' as unknown as number,
    borderRadius: 24,
    borderWidth: 8,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  stackWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFF',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    zIndex: 1000,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  toolbarBadge: {
    backgroundColor: '#0EA5E9',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  toolbarBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  toolbarUser: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
    maxWidth: 110,
  },
  toolbarButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  toolBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toolBtnActive: {
    backgroundColor: TEAL,
  },
  toolBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  toolBtnTextActive: {
    color: '#FFF',
  },
});
