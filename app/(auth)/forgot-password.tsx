import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../src/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Peringatan', 'Silakan masukkan email dan kata sandi baru Anda.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Peringatan', 'Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Peringatan', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), new_password: password }),
      });
      const data = await res.json();

      if (res.ok && data?.status === 'success') {
        Alert.alert('Sukses', 'Kata sandi berhasil diperbarui! Silakan masuk.', [
          { text: 'Masuk Sekarang', onPress: () => router.replace('/(auth)/sign-in') },
        ]);
      } else {
        Alert.alert('Gagal Reset', data.detail || 'Gagal memperbarui kata sandi.');
      }
    } catch (e) {
      Alert.alert('Koneksi Gagal', 'Tidak dapat menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>

        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-3">
            <Ionicons name="key-outline" size={36} color="#2a85ff" />
          </View>
          <Text className="text-2xl font-black text-slate-800">Lupa Kata Sandi</Text>
          <Text className="text-xs text-slate-400 mt-1 text-center">
            Masukkan email terdaftar dan kata sandi baru Anda.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Email</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800"
              placeholder="nama@email.com" placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Kata Sandi Baru</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800"
              placeholder="Minimal 6 karakter" placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Konfirmasi Kata Sandi</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-800"
              placeholder="Ulangi kata sandi baru" placeholderTextColor="#94a3b8"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleReset}
            disabled={loading}
            className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-2"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-sm">Simpan Kata Sandi Baru</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-xs text-slate-400">Ingat kata sandi? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <Text className="text-xs font-bold text-primary">Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}