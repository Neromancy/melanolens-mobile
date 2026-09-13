import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function TabsLayout() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';

  // Every screen stays declared so Expo Router registers it as a route. To show
  // it only for a role we set options.hidden (verified: the tab navigator
  // filters `options?.hidden !== true` at route->tab build time). Declaring a
  // <Tabs.Screen/> under a `&&` or inside a fragment does NOT remove a file
  // route from the tab bar.
  //
  // Tab order = declaration order of VISIBLE screens:
  //   admin   -> Home, Scan, Dashboard, Berkas, Profile
  //   patient -> Home, Scan, Riwayat, Profile
  //
  // `hidden` is read at runtime but missing from TabsProps' type, hence the cast.
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
        tabBarActiveTintColor: '#2a85ff',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 76,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
        },
      }}
    >
      {/* 1. Home (all) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      {/* 2. Scan (all) */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size} color={color} />,
        }}
      />
      {/* 3. Dashboard (admin only) */}
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: 'Dashboard',
          hidden: !isAdmin,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        } as any}
      />
      {/* 4. Berkas (admin only) */}
      <Tabs.Screen
        name="admin-berkas"
        options={{
          title: 'Berkas',
          hidden: !isAdmin,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="file-tray" size={size} color={color} />
          ),
        } as any}
      />
      {/* Riwayat -> this patient's own records (patients only) */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Riwayat',
          hidden: isAdmin,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="time" size={size} color={color} />,
        } as any}
      />
      {/* 5. Profile (last / rightmost, all) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}