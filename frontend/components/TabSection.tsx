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

const COLLAPSED_LINES = 4;

export function TabSection({ tabs }: Props) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? '');
  const [expanded, setExpanded] = useState(false);

  const active = tabs.find((t) => t.key === activeKey);

  const handleTabPress = (key: string) => {
    setActiveKey(key);
    setExpanded(false); // collapse when switching tabs
  };

  return (
    <View style={styles.section}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeKey === tab.key && styles.activeTab]}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, activeKey === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {active && (
        <View style={styles.content}>
          <Text
            style={styles.text}
            numberOfLines={expanded ? undefined : COLLAPSED_LINES}
          >
            {active.content}
          </Text>
          <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={styles.toggle}>
            <Text style={styles.toggleText}>
              {expanded ? 'View less ▲' : 'View more ▼'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const TEAL = '#16A093';

const styles = StyleSheet.create({
  section:        { marginHorizontal: 12, marginVertical: 8 },
  tabBar:         { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginBottom: 12 },
  tab:            { paddingVertical: 10, paddingRight: 16, marginBottom: -1 },
  activeTab:      { borderBottomWidth: 2, borderBottomColor: TEAL },
  tabLabel:       { fontSize: 13, color: '#999', fontWeight: '500' },
  activeTabLabel: { color: TEAL, fontWeight: '700' },
  content:        { marginTop: 4 },
  text:           { fontSize: 13, color: '#444444', lineHeight: 20 },
  toggle:         { marginTop: 8, alignItems: 'center' },
  toggleText:     { fontSize: 12, color: '#777777', fontWeight: '600' },
});
