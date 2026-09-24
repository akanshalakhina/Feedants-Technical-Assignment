import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export type CTAAction = 'login' | 'register' | 'upload' | null;

export interface CTAState {
  label: string;
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
          <Text style={styles.ctaText}>{cta.label}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  ctaWrap: {
    position: 'absolute',
    bottom: 58, // Sits directly above bottom navigation
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    zIndex: 10,
  },
  ctaBtn: {
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
