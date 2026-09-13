import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function TabsLayout() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';

  // Each tab is a DIRECT <Tabs.Screen> child. Do NOT wrap them in fragments
  // (<>) — expo-router ignores any non-Screen child and would drop the tab.
  // Icon names are verified Ionicons glyphs (bar-chart, file-tray, scan, home, time, person).
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
        },
      }}
    >
      {/* 1. Home (all users) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      {/* 2. Scan (all users) */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size} color={color} />,
        }}
      />
      {/* 3-4. Admin: Dashboard + Berkas. Patient: own Riwayat. */}
      {isAdmin && (
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" size={size} color={color} />
            ),
          }}
        />
      )}
      {isAdmin && (
        <Tabs.Screen
          name="admin-berkas"
          options={{
            title: 'Berkas',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="file-tray" size={size} color={color} />
            ),
          }}
        />
      )}
      {!isAdmin && (
        <Tabs.Screen
          name="history"
          options={{
            title: 'Riwayat',
            tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
          }}
        />
      )}
      {/* Profile (last / rightmost, all users) */}
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