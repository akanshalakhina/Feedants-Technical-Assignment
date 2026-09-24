import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export type CTAAction = 'login' | 'register' | 'upload' | null;

export interface CTAState {
  label: string;
  subLabel?: string;
  disabled: boolean;
  action: CTAAction;
}

interface Props {
  cta: CTAState;
  registering: boolean;
  onPress: () => void;
}

export function BottomCTA({ cta, registering, onPress }: Props) {
  return (
    <View style={styles.ctaWrap}>
      <TouchableOpacity
        style={[styles.ctaBtn, cta.disabled && styles.ctaBtnDisabled]}
        onPress={onPress}
        disabled={cta.disabled || registering}
        activeOpacity={0.85}
      >
        {registering ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <View style={styles.contentCol}>
            <Text style={styles.ctaText}>{cta.label}</Text>
            {cta.subLabel ? (
              <Text style={styles.ctaSubText}>{cta.subLabel}</Text>
            ) : null}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const TEAL = '#005953';

const styles = StyleSheet.create({
  ctaWrap: {
    position: 'absolute',
    bottom: 56, // Sits directly above bottom navigation
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F9FA',
    zIndex: 10,
  },
  ctaBtn: {
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  contentCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  ctaSubText: {
    color: '#D1FAF5',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
});
