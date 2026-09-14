import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../src/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [nama, setNama] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [pekerjaan, setPekerjaan] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (!nama.trim() || !tanggalLahir.trim() || !pekerjaan.trim()) {
      Alert.alert('Peringatan', 'Silakan lengkapi seluruh informasi dasar.');
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Peringatan', 'Email dan kata sandi wajib diisi.');
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
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: nama.trim(),
          email: email.trim(),
          password,
          tanggal_lahir: tanggalLahir.trim(),
          jenis_kelamin: jenisKelamin,
          pekerjaan: pekerjaan.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Registrasi Berhasil', 'Akun berhasil didaftarkan! Silakan masuk.', [
          { text: 'Masuk Sekarang', onPress: () => router.replace('/(auth)/sign-in') },
        ]);
      } else {
        Alert.alert('Gagal Daftar', data.detail || 'Gagal membuat akun baru.');
      }
    } catch (e) {
      Alert.alert('Koneksi Gagal', 'Gagal terhubung ke backend FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <TouchableOpacity
        onPress={() => (step === 2 ? setStep(1) : router.back())}
        className="mb-4 mt-8"
      >
        <Ionicons name="arrow-back" size={24} color="#1e293b" />
      </TouchableOpacity>

      <View className="items-center mb-5">
          <Image
            source={require('../../assets/brand/logo-light-full.png')}
            style={{ width: 210, height: 30 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-lg font-black text-slate-800">Daftar Akun Baru</Text>
      <Text className="text-xs text-slate-400 mt-1 mb-6">
        Langkah {step} dari 2: {step === 1 ? 'Informasi Demografis' : 'Kredensial Keamanan'}
      </Text>

      {step === 1 ? (
        <View className="space-y-4">
          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs text-slate-800"
              placeholder="Masukkan nama lengkap Anda" placeholderTextColor="#94a3b8"
              value={nama}
              onChangeText={setNama}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Tanggal Lahir (YYYY-MM-DD)</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs text-slate-800"
              placeholder="Contoh: 1999-12-31" placeholderTextColor="#94a3b8"
              value={tanggalLahir}
              onChangeText={setTanggalLahir}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setJenisKelamin('Laki-laki')}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  jenisKelamin === 'Laki-laki'
                    ? 'bg-primary/10 border-primary'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    jenisKelamin === 'Laki-laki' ? 'text-primary' : 'text-slate-600'
                  }`}
                >
                  Laki-laki
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setJenisKelamin('Perempuan')}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  jenisKelamin === 'Perempuan'
                    ? 'bg-primary/10 border-primary'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    jenisKelamin === 'Perempuan' ? 'text-primary' : 'text-slate-600'
                  }`}
                >
                  Perempuan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Pekerjaan</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs text-slate-800"
              placeholder="Contoh: Pegawai, Mahasiswa, Guru" placeholderTextColor="#94a3b8"
              value={pekerjaan}
              onChangeText={setPekerjaan}
            />
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-4"
          >
            <Text className="text-white font-bold text-xs">Lanjut ke Langkah 2 →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-4">
          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Email</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs text-slate-800"
              placeholder="nama@email.com" placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Kata Sandi</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs text-slate-800"
              placeholder="Minimal 6 karakter" placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-600 mb-1">Konfirmasi Kata Sandi</Text>
            <TextInput
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs text-slate-800"
              placeholder="Ulangi kata sandi" placeholderTextColor="#94a3b8"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-4"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-xs">Daftar Akun</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row justify-center items-center mt-6 mb-12">
        <Text className="text-xs text-slate-400">Sudah memiliki akun? </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
          <Text className="text-xs font-bold text-primary">Masuk di sini</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}