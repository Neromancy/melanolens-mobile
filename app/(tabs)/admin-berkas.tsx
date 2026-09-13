import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { API_BASE_URL } from '../../src/constants/config';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

interface AdminRecord {
  scan_id: number;
  user_id: number;
  user_nama: string;
  scan_gambar: string;
  scan_tanggal: string;
  scan_persentase: number;
  scan_respon: string;
}

export default function AdminBerkasScreen() {
  const token = useAuthStore((s) => s.token);
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<AdminRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setRecords(await res.json());
      }
    } catch (e) {
      console.warn('Gagal memuat rekam medis admin:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const isMalignant = (r: string) => /melanoma|ganas/i.test(r || '');

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-lg font-black text-slate-800 mb-1">Berkas Medis</Text>
      <Text className="text-xs text-slate-400 mb-4">Seluruh rekam medis pengguna</Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2a85ff" />
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.scan_id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRecords(); }} />
          }
          ListEmptyComponent={
            <View className="py-24 items-center">
              <Ionicons name="file-tray-outline" size={48} color="#94a3b8" />
              <Text className="text-sm font-semibold text-slate-500 mt-2">Belum ada berkas medis.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelected(item)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-3 flex-row items-center gap-3 active-opacity-80"
            >
              <Image source={{ uri: item.scan_gambar }} className="w-14 h-14 rounded-xl bg-slate-100" resizeMode="cover" />
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-xs text-slate-800 capitalize">{item.user_nama}</Text>
                  <Text
                    className={
                      `px-2 py-0.5 rounded-full text-[10px] font-bold ${isMalignant(item.scan_respon) ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`
                    }
                  >
                    {(item.scan_persentase * 100).toFixed(1)}%
                  </Text>
                </View>
                <Text className="text-[11px] text-slate-400 mt-1">{item.scan_respon.replace('_', ' ')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Detail Modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-black text-slate-800">Berkas #{selected?.scan_id}</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close-circle" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            {selected && (
              <ScrollView>
                <Image source={{ uri: selected.scan_gambar }} className="w-full h-56 rounded-2xl bg-slate-100 mb-4" resizeMode="contain" />
                <View className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-2">
                  <Row label="Pasien" value={selected.user_nama} />
                  <Row label="Diagnosis AI" value={selected.scan_respon} />
                  <Row label="Tingkat Keyakinan" value={`${(selected.scan_persentase * 100).toFixed(2)}%`} />
                  <Row label="ID Berkas" value={String(selected.scan_id)} />
                  <Row label="ID Pasien" value={String(selected.user_id)} />
                  <Row label="Tanggal" value={selected.scan_tanggal} />
                </View>
                <TouchableOpacity
                  onPress={() => setSelected(null)}
                  className="w-full h-12 bg-primary rounded-xl items-center justify-center mt-2 mb-6"
                >
                  <Text className="text-white font-bold text-xs">Tutup Berkas</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-xs text-slate-400">{label}</Text>
      <Text className="text-xs font-bold text-slate-700 capitalize">{value}</Text>
    </View>
  );
}