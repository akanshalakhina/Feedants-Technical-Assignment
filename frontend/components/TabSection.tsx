import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Tab {
  key: string;
  label: string;
  content: string;
}

interface Props {
  tabs: Tab[];
}

const COLLAPSED_LINES = 3;

export function TabSection({ tabs }: Props) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? '');
  const [expanded, setExpanded] = useState(false);

  const active = tabs.find((t) => t.key === activeKey);

  const handleTabPress = (key: string) => {
    setActiveKey(key);
    setExpanded(false);
  };

  return (
    <View style={styles.card}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {active && (
        <View style={styles.content}>
          <Text style={styles.text} numberOfLines={expanded ? undefined : COLLAPSED_LINES}>
            {active.content}
          </Text>
          <TouchableOpacity
            onPress={() => setExpanded((e) => !e)}
            style={styles.toggle}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleText}>
              {expanded ? 'View less ∧' : 'View more ∨'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingRight: 16,
    marginBottom: -1,
  },
  activeTab: {
    borderBottomWidth: 2.5,
    borderBottomColor: TEAL,
  },
  tabLabel: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  activeTabLabel: {
    color: TEAL,
    fontWeight: '800',
  },
  content: {
    paddingTop: 2,
  },
  text: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 19,
  },
  toggle: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 11.5,
    color: TEAL,
    fontWeight: '700',
  },
});
