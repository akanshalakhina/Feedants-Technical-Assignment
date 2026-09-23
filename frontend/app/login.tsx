import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode]         = useState<Mode>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      Alert.alert('Missing fields', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      router.back();
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Go back</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>🎭 Feedants</Text>
          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </Text>

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.btnText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={toggle} style={styles.switchRow}>
            <Text style={styles.switchText}>
              {mode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text style={styles.switchLink}>
                {mode === 'login' ? 'Sign up' : 'Login'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Demo credentials */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>🧪 Demo Accounts (after running seed):</Text>
            <Text style={styles.demoRow}>✅ Registered:  arjun@example.com / password123</Text>
            <Text style={styles.demoRow}>🆕 Unregistered: priya@example.com / password456</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#FFF' },
  scroll:     { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  backBtn:    { marginBottom: 24 },
  backText:   { fontSize: 16, color: '#16A093', fontWeight: '500' },
  logo:       { fontSize: 26, fontWeight: '800', color: '#16A093', marginBottom: 6 },
  title:      { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 28 },
  input: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
    marginBottom: 12, backgroundColor: '#FAFAFA',
  },
  btn: {
    backgroundColor: '#16A093', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  btnDisabled:  { opacity: 0.65 },
  btnText:      { color: '#FFF', fontSize: 16, fontWeight: '800' },
  switchRow:    { alignItems: 'center', marginTop: 20 },
  switchText:   { fontSize: 14, color: '#555' },
  switchLink:   { color: '#16A093', fontWeight: '700' },
  demoBox: {
    marginTop: 36, backgroundColor: '#F0FAFA', borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: '#C8ECEA',
  },
  demoTitle:    { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  demoRow:      { fontSize: 12, color: '#555', marginBottom: 4 },
});
