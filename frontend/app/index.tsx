import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, Competition } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { competitions: list } = await api.competitions.list();
      setCompetitions(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load competitions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎭 Feedants</Text>
        {user ? (
          <View style={styles.userRow}>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.logoutBtn}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginBtn}>Login / Sign up</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.pageTitle}>🏆 Competitions</Text>

      {loading ? (
        <ActivityIndicator color="#16A093" size="large" style={{ marginTop: 60 }} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => load()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={competitions}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(true); }}
              tintColor="#16A093"
            />
          }
          renderItem={({ item }) => <CompetitionCard item={item} onPress={() => router.push(`/competition/${item._id}`)} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No competitions available right now.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

function CompetitionCard({ item, onPress }: { item: Competition; onPress: () => void }) {
  const remaining = item.totalSpots - item.bookedSpots;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.cardStats}>
        <Stat label="Prize Pool" value={`₹ ${item.prizePool.toLocaleString('en-IN')}`} teal />
        <Stat label="Entry Fee"  value={`₹ ${item.entryFee}`} />
        <Stat label="Spots Left" value={remaining > 0 ? String(remaining) : 'Full'} urgent={remaining <= 5} />
      </View>
    </TouchableOpacity>
  );
}

function Stat({ label, value, teal, urgent }: { label: string; value: string; teal?: boolean; urgent?: boolean }) {
  return (
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, teal && styles.tealText, urgent && styles.urgentText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F5F5F5' },
  header:      {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#EBEBEB',
  },
  logo:        { fontSize: 18, fontWeight: '800', color: '#16A093' },
  userRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, maxWidth: '60%' },
  userName:    { fontSize: 14, color: '#333', flexShrink: 1 },
  logoutBtn:   { fontSize: 14, color: '#E05C2C', fontWeight: '700' },
  loginBtn:    { fontSize: 14, color: '#16A093', fontWeight: '700' },
  pageTitle:   { fontSize: 20, fontWeight: '800', color: '#1A1A1A', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  list:        { paddingHorizontal: 12, paddingBottom: 40 },
  card:        {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle:   { fontSize: 15, fontWeight: '800', color: '#1A1A1A', flex: 1, marginRight: 8 },
  categoryBadge:{ backgroundColor: '#E8F5F4', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  categoryText:{ fontSize: 11, color: '#16A093', fontWeight: '700' },
  cardStats:   { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel:   { fontSize: 11, color: '#999', marginBottom: 3 },
  statValue:   { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  tealText:    { color: '#16A093' },
  urgentText:  { color: '#E05C2C' },
  errorBox:    { alignItems: 'center', marginTop: 60 },
  errorText:   { fontSize: 15, color: '#E05C2C', textAlign: 'center', marginBottom: 16, marginHorizontal: 20 },
  retryBtn:    { backgroundColor: '#16A093', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText:   { color: '#FFF', fontWeight: '700' },
  emptyText:   { textAlign: 'center', color: '#AAA', marginTop: 60, fontSize: 15 },
});
