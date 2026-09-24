import React from 'react';
import { Platform, Text, View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// ── Line-Art Trophy Cup Icon ──
export function TrophyIcon({ size = 16, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1h12v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M6 4h12v6c0 3.31-2.69 6-6 6s-6-2.69-6-6V4z" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>🏆</Text>;
}

// ── Line-Art Calendar Icon ──
export function CalendarIcon({ size = 16, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="8" cy="14" r="1" fill={color} />
          <circle cx="12" cy="14" r="1" fill={color} />
          <circle cx="16" cy="14" r="1" fill={color} />
          <circle cx="8" cy="18" r="1" fill={color} />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>📅</Text>;
}

// ── Line-Art Paper Airplane / Send Icon ──
export function PlaneIcon({ size = 16, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>✈️</Text>;
}

// ── Line-Art Upload Tray Icon ──
export function UploadIcon({ size = 16, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>⬆️</Text>;
}

// ── Line-Art Hourglass Icon ──
export function HourglassIcon({ size = 15, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>⌛</Text>;
}

// ── Line-Art Stopwatch Icon ──
export function StopwatchIcon({ size = 15, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="14" r="8" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="14" x2="12" y2="10" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>⏱️</Text>;
}

// ── Line-Art Star Icon ──
export function StarOutlineIcon({ size = 16, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>☆</Text>;
}

// ── Line-Art People / Users Icon ──
export function UsersIcon({ size = 15, color = '#00796B', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>👥</Text>;
}

// ── Line-Art Shield Checkmark Icon ──
export function ShieldCheckIcon({ size = 15, color = '#0F1E36', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>🛡️</Text>;
}

// ── Line-Art Megaphone Icon ──
export function MegaphoneIcon({ size = 22, color = '#10B981', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l18-5v12L3 13v-2z" />
          <path d="M11.6 16.8L9 22H6l2.4-7.2" />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>📢</Text>;
}

// ── Chat Bubble Icon with 3 Dots ──
export function ChatDotsIcon({ size = 18, color = '#0F1E36', style }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="8" cy="10" r="1" fill={color} />
          <circle cx="12" cy="10" r="1" fill={color} />
          <circle cx="16" cy="10" r="1" fill={color} />
        </svg>
      </View>
    );
  }
  return <Text style={[{ fontSize: size, color }, style]}>💬</Text>;
}

// ── Home Icon ──
export function HomeIcon({ size = 18, color = '#707E94' }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  return <Text style={{ fontSize: size, color }}>🏠</Text>;
}

// ── Search Icon ──
export function SearchIcon({ size = 18, color = '#707E94' }: IconProps) {
  if (Platform.OS === 'web') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  }
  return <Text style={{ fontSize: size, color }}>🔍</Text>;
}
