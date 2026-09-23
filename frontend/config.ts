import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach the host machine's localhost.
// iOS simulator and Web can use localhost directly.
// Physical devices can override this via EXPO_PUBLIC_API_URL or by setting their local LAN IP.
const getDefaultUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? getDefaultUrl();

