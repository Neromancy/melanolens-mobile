import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { API_BASE_URL } from '../../src/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, token, updateUser, logout } = useAuthStore();

  const [nama, setNama] = useState(user?.name || '');
  const [tanggalLahir, setTanggalLahir] = useState(user?.tanggal_lahir || '');
  const [jenisKelamin, setJenisKelamin] = useState(user?.jenis_kelamin || 'Laki-laki');
  const [pekerjaan, setPekerjaan] = useState(user?.pekerjaan || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nama.trim()) {
      Alert.alert('Peringatan', 'Nama lengkap tidak boleh kosong.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_nama: nama.trim(),
          user_tanggalLahir: tanggalLahir.trim(),
          user_jenisKelamin: jenisKelamin,
          user_pekerjaan: pekerjaan.trim(),
          user_email: user?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Gagal memperbarui profil.');
      }

      await updateUser({
        name: nama.trim(),
        tanggal_lahir: tanggalLahir.trim(),
        jenis_kelamin: jenisKelamin,
        pekerjaan: pekerjaan.trim(),
      });

      Alert.alert('Sukses', 'Profil rekam medis Anda berhasil diperbarui!');
    } catch (e: any) {
      Alert.alert('Gagal Update', e.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar dari MelanoLens?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* Patient Avatar Card */}
      <View className="bg-white rounded-2xl p-5 items-center border border-slate-100 mb-5">
        <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center border-2 border-primary/20 mb-3">
          <Text className="text-2xl font-black text-primary uppercase">
            {user?.name ? user.name.charAt(0) : 'U'}
          </Text>
        </View>
        <Text className="text-base font-black text-slate-800">{user?.name}</Text>
        <Text className="text-xs text-slate-400 mt-0.5">{user?.email}</Text>
        <View className="mt-2 bg-slate-100 px-3 py-1 rounded-full">
          <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
            Peran: {user?.role}
          </Text>
        </View>
      </View>

      {/* Patient Demographic Form */}
      <View className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4 mb-5">
        <Text className="text-xs font-bold text-slate-800 mb-1">Data Rekam Medis Pasien</Text>

        <View>
          <Text className="text-[11px] font-semibold text-slate-500 mb-1">Nama Lengkap</Text>
          <TextInput
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800"
            value={nama}
            onChangeText={setNama}
            placeholder="Nama Lengkap"
          />
        </View>

        <View>
          <Text className="text-[11px] font-semibold text-slate-500 mb-1">Email (Terkunci)</Text>
          <TextInput
            className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs text-slate-400"
            value={user?.email}
            editable={false}
          />
        </View>

        <View>
          <Text className="text-[11px] font-semibold text-slate-500 mb-1">
            Tanggal Lahir (YYYY-MM-DD)
          </Text>
          <TextInput
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800"
            value={tanggalLahir}
            onChangeText={setTanggalLahir}
            placeholder="1998-05-20"
          />
        </View>

        <View>
          <Text className="text-[11px] font-semibold text-slate-500 mb-1">Jenis Kelamin</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setJenisKelamin('Laki-laki')}
              className={`flex-1 py-2.5 rounded-xl border items-center ${
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
              className={`flex-1 py-2.5 rounded-xl border items-center ${
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
          <Text className="text-[11px] font-semibold text-slate-500 mb-1">Pekerjaan</Text>
          <TextInput
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-800"
            value={pekerjaan}
            onChangeText={setPekerjaan}
            placeholder="Contoh: Karyawan, Mahasiswa, Dokter"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-3"
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-xs">Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        onPress={handleLogout}
        className="w-full h-12 bg-red-50 border border-red-200 rounded-xl flex-row items-center justify-center gap-2 mb-10"
      >
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text className="text-red-500 font-bold text-xs">Keluar dari Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}