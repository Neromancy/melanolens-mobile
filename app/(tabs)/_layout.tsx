import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function TabsLayout() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';

  return (
    <Tabs
      initialRouteName={isAdmin ? 'admin-dashboard' : 'index'}
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
      {isAdmin ? (
        <>
          <Tabs.Screen
            name="admin-dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="admin-berkas"
            options={{
              title: 'Berkas',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="folder-open" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan AI',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="scan-circle" size={size + 3} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Beranda',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan AI',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="scan-circle" size={size + 3} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'Riwayat',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
                      name="profile"
                      options={{
                        title: 'Profil',
                        tabBarIcon: ({ color, size }) => (
                          <Ionicons name="person" size={size} color={color} />
                        ),
                      }}
                    />
        </>
      )}
    </Tabs>
  );
}