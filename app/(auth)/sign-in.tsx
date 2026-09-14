import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { API_BASE_URL } from '../../src/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Peringatan', 'Silakan masukkan email dan kata sandi Anda.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data?.user) {
        await setAuth(data.token, {
                  id: data.user.id ?? data.user.email,
          name: data.user.name,
          email: data.user.email,
          role: data.user.authority?.[0] || 'user',
          tanggal_lahir: data.user.tanggal_lahir || '',
          jenis_kelamin: data.user.jenis_kelamin || '',
          pekerjaan: data.user.pekerjaan || '',
        });
      } else {
        Alert.alert('Gagal Masuk', data.detail || 'Kredensial login tidak cocok.');
      }
    } catch (e: any) {
      Alert.alert('Koneksi Gagal', 'Tidak dapat menghubungi server backend FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
        <View className="items-center mb-8">
                  <Image
                    source={require('../../assets/brand/logo-light-full.png')}
                    style={{ width: 210, height: 30 }}
                    resizeMode="contain"
                  />
                  <Text className="text-xs text-slate-400 mt-2">Deteksi Dini Melanoma Berbasis AI</Text>
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
            <Text className="text-xs font-semibold text-slate-600 mb-1">Kata Sandi</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-12">
              <TextInput
                className="flex-1 text-sm text-slate-800"
                placeholder="Masukkan kata sandi" placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="items-end mt-1">
                      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                        <Text className="text-xs font-bold text-primary">Lupa kata sandi?</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={handleSignIn}
                      disabled={loading}
                      className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-2"
                    >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-sm">Masuk</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-xs text-slate-400">Belum memiliki akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-xs font-bold text-primary">Daftar di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}