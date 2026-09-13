import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* Patient Welcome Header */}
      <View className="bg-primary rounded-3xl p-6 mb-6 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider">
            Selamat Datang
          </Text>
          <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
            <Text className="text-white text-[10px] font-bold capitalize">
              {user?.role || 'Pasien'}
            </Text>
          </View>
        </View>
        <Text className="text-white text-2xl font-black mb-1">{user?.name || 'Pengguna'}</Text>
        <Text className="text-white/90 text-xs leading-relaxed">
          Pantau lesi kulit Anda secara mandiri menggunakan model Gated MobileNetV2 dan standardisasi parameter klinis ABCD.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/scan')}
          className="bg-white mt-5 py-3 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
        >
          <Ionicons name="scan" size={18} color="#2a85ff" />
          <Text className="text-primary font-extrabold text-sm">Mulai Skrining Sekarang →</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text className="text-sm font-bold text-slate-800 mb-3">Akses Cepat</Text>
      <View className="flex-row gap-3 mb-6">
              {isAdmin ? (
                <>
                  <QuickAction label="Dashboard" sub="Statistik" icon="bar-chart" color="#2a85ff" bg="bg-sky-50"
                    onPress={() => router.push('/(tabs)/admin-dashboard')} />
                  <QuickAction label="Berkas" sub="Rekam Medis" icon="file-tray" color="#10b981" bg="bg-emerald-50"
                    onPress={() => router.push('/(tabs)/admin-berkas')} />
                  <QuickAction label="Scan" sub="Analisis Lesi" icon="camera" color="#f59e0b" bg="bg-amber-50"
                    onPress={() => router.push('/(tabs)/scan')} />
                </>
              ) : (
                <>
                  <QuickAction label="Scan Baru" sub="Analisis Lesi" icon="camera" color="#028cf3" bg="bg-sky-50"
                    onPress={() => router.push('/(tabs)/scan')} />
                  <QuickAction label="Riwayat" sub="Rekam Medis" icon="document-text" color="#10b981" bg="bg-emerald-50"
                    onPress={() => router.push('/(tabs)/history')} />
                  <QuickAction label="Profil" sub="Data Pasien" icon="person-circle" color="#8b5cf6" bg="bg-violet-50"
                    onPress={() => router.push('/(tabs)/profile')} />
                </>
              )}
            </View>

      {/* Technology Specifications */}
      <Text className="text-sm font-bold text-slate-800 mb-3">Teknologi MelanoLens</Text>
      <View className="space-y-3 mb-8">
        <View className="bg-white p-4 rounded-2xl border border-slate-100 flex-row gap-3 items-center">
          <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
            <Ionicons name="git-network" size={20} color="#6366f1" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-800">Model Gated MobileNetV2</Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">
              Klasifikasi deep learning terarah dengan isolasi fokus pada area jaringan lesi.
            </Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl border border-slate-100 flex-row gap-3 items-center">
          <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center">
            <Ionicons name="eye" size={20} color="#f59e0b" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-800">Explainable AI (Heatmap)</Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">
              Peta atensi visual untuk transparansi interpretasi diagnostik kecerdasan buatan.
            </Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl border border-slate-100 flex-row gap-3 items-center">
          <View className="w-10 h-10 rounded-xl bg-teal-50 items-center justify-center">
            <Ionicons name="shield-checkmark" size={20} color="#14b8a6" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-800">Standardisasi Medis ABCD</Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">
              Kalkulasi kuantitatif Asymmetry, Border, Color, dan Diameter serta Total Dermatoscopy Score (TDS).
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function QuickAction({ label, sub, icon, color, bg, onPress }: {
  label: string; sub: string; icon: any; color: string; bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 items-center"
    >
      <View className={`w-12 h-12 rounded-xl items-center justify-center mb-2 ${bg}`}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-xs font-bold text-slate-800">{label}</Text>
      <Text className="text-[10px] text-slate-400 mt-0.5">{sub}</Text>
    </TouchableOpacity>
  );
}
