import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type Language = 'en' | 'hi';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
}

export function CompetitionHeader({ language, onLanguageChange, onBack }: Props) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      {/* Language Toggle Pill matching Page 3 reference */}
      <View style={styles.langPill}>
        <TouchableOpacity
          style={[styles.langSide, language === 'en' && styles.langSideActive]}
          onPress={() => onLanguageChange('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>ENG</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langSide, language === 'hi' && styles.langSideActive]}
          onPress={() => onLanguageChange('hi')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backArrow: {
    fontSize: 18,
    color: '#0B1E3B',
    fontWeight: '700',
  },
  backText: {
    fontSize: 15,
    color: '#0B1E3B',
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langSide: {
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 16,
  },
  langSideActive: {
    backgroundColor: TEAL,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
