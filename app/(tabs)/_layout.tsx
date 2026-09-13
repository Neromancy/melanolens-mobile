import { Stack, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

// expo-router's <Tabs> auto-renders a tab for EVERY route file in (tabs)/ and,
// on Android, ignores 'options.hidden' — so admin screens leaked into the
// patient tab bar. Fix: use <Stack> (no built-in tab bar) and render our own
// bottom navigation that only lists the current role's screens. Screen files
// all still exist as guarded routes; the bar just never links the wrong ones.
//
// NOTE: index.tsx is the GROUP ROOT -> its nav route is '/(tabs)', NOT
// '/(tabs)/index' (there is no such segment, pushing it = unmatched route).

type NavItem = { key: string; label: string; icon: any; route: string };

const ADMIN_BAR: NavItem[] = [
  { key: 'index', label: 'Home', icon: 'home', route: '/(tabs)' },
  { key: 'scan', label: 'Scan', icon: 'scan', route: '/(tabs)/scan' },
  { key: 'admin-dashboard', label: 'Dashboard', icon: 'bar-chart', route: '/(tabs)/admin-dashboard' },
  { key: 'admin-berkas', label: 'Berkas', icon: 'file-tray', route: '/(tabs)/admin-berkas' },
  { key: 'profile', label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
];

const PATIENT_BAR: NavItem[] = [
  { key: 'index', label: 'Home', icon: 'home', route: '/(tabs)' },
  { key: 'scan', label: 'Scan', icon: 'scan', route: '/(tabs)/scan' },
  { key: 'history', label: 'Riwayat', icon: 'time', route: '/(tabs)/history' },
  { key: 'profile', label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
];

export default function TabsLayout() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const bar = isAdmin ? ADMIN_BAR : PATIENT_BAR;
  const router = useRouter();
  const pathname = usePathname();
  // current screen name; index renders as the group root '/(tabs)'
  const segs = pathname.split('/').filter(Boolean);
  const lastSeg = segs[segs.length - 1];
  const currentKey = pathname.startsWith('/(tabs)') && (lastSeg === undefined || lastSeg === 'tabs')
    ? 'index'
    : lastSeg;

  return (
    <View className="flex-1 bg-slate-50">
          {/* top brand bar (replaces the nav header/back arrow) */}
          <View
            className="w-full items-center justify-center"
            style={{ height: 56, backgroundColor: '#ffffff' }}
          >
            <Image
              source={require('../../assets/brand/logo-dark-full.png')}
              style={{ width: 170, height: 25 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-1">
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="scan" />
              <Stack.Screen name="admin-dashboard" />
              <Stack.Screen name="admin-berkas" />
              <Stack.Screen name="history" />
              <Stack.Screen name="profile" />
            </Stack>
          </View>

      {/* role-filtered bottom navigation */}
      <View
        className="flex-row items-center justify-center bg-white border-t border-slate-100"
        style={{ height: 74, paddingTop: 6, paddingBottom: 12 }}
      >
        {bar.map((item) => {
          const on = item.key === currentKey;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => router.push(item.route)}
              className="flex-1 items-center justify-center"
            >
              <Ionicons name={item.icon} size={22} color={on ? '#2a85ff' : '#94a3b8'} />
              <Text className={`text-[9px] mt-0.5 ${on ? 'text-primary' : 'text-slate-400'}`}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}