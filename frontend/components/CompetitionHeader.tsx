import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type Language = 'en' | 'hi';

interface Props {
  title: string;
  tags: string[];
  isRegistered: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
}

export function CompetitionHeader({
  title,
  tags,
  isRegistered,
  language,
  onLanguageChange,
  onBack,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Top action row */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>

        {/* Language selector toggle */}
        <View style={styles.langToggle}>
          {(['en', 'hi'] as Language[]).map((lang) => {
            const isActive = language === lang;
            return (
              <TouchableOpacity
                key={lang}
                style={[styles.langBtn, isActive && styles.langBtnActive]}
                onPress={() => onLanguageChange(lang)}
                activeOpacity={0.8}
              >
                <Text style={[styles.langBtnText, isActive && styles.langBtnTextActive]}>
                  {lang === 'en' ? 'ENG' : 'हिंदी'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Title & Registered Status badge */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Text style={styles.registeredBadgeText}>✓ Registered</Text>
          </View>
        )}
      </View>

      {/* Tags row */}
      <View style={styles.tagsRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tagBadge}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <View style={styles.certRow}>
          <Text style={styles.certIcon}>🏆</Text>
          <Text style={styles.certText}>Winners get certificate</Text>
        </View>
      </View>
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backArrow: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  backText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langBtn: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  langBtnActive: {
    backgroundColor: TEAL,
  },
  langBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  langBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    flex: 1,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F7F5',
    borderWidth: 1,
    borderColor: '#A4DFD8',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  registeredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certIcon: {
    fontSize: 12,
  },
  certText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
