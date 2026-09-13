import React, { useState, useEffect } from 'react';
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
import { useAuthStore } from '../../src/store/useAuthStore';
import { API_BASE_URL } from '../../src/constants/config';
import { ScanHistoryItem } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/skrining/history?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.warn('Gagal memuat riwayat:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  return (
    <View className="flex-1 bg-slate-50 p-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#2a85ff" size="large" />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => String(item.scan_id)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchHistory();
              }}
            />
          }
          ListEmptyComponent={
            <View className="py-24 items-center">
              <Ionicons name="file-tray-outline" size={48} color="#94a3b8" />
              <Text className="text-sm font-semibold text-slate-500 mt-2">
                Belum ada riwayat pemeriksaan.
              </Text>
              <Text className="text-xs text-slate-400 mt-0.5">
                Foto yang Anda periksa akan tersimpan di sini.
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isMalignant =
              item.scan_respon.toLowerCase().includes('melanoma') ||
              item.scan_respon.toLowerCase().includes('ganas');

            return (
              <TouchableOpacity
                onPress={() => setSelectedItem(item)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-3 flex-row items-center gap-3 active:opacity-80"
              >
                <Image
                  source={{ uri: item.scan_gambar }}
                  className="w-14 h-14 rounded-xl bg-slate-100"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-bold text-xs text-slate-800 capitalize">
                      {item.scan_respon.replace('_', ' ')}
                    </Text>
                    <Text
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMalignant ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {(item.scan_persentase * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <Text className="text-[11px] text-slate-400 mt-1">
                    {new Date(item.scan_tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Inspection Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-black text-slate-800">
                Detail Berkas #{selectedItem?.scan_id}
              </Text>
              <TouchableOpacity onPress={() => setSelectedItem(null)}>
                <Ionicons name="close-circle" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView>
                <Image
                  source={{ uri: selectedItem.scan_gambar }}
                  className="w-full h-56 rounded-2xl bg-slate-100 mb-4"
                  resizeMode="contain"
                />
                <View className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-400">Diagnosis AI</Text>
                    <Text className="text-xs font-bold text-primary capitalize">
                      {selectedItem.scan_respon.replace('_', ' ')}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-400">Tingkat Keyakinan</Text>
                    <Text className="text-xs font-bold text-slate-700">
                      {(selectedItem.scan_persentase * 100).toFixed(2)}%
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-400">Tanggal Pemeriksaan</Text>
                    <Text className="text-xs font-bold text-slate-700">
                      {new Date(selectedItem.scan_tanggal).toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedItem(null)}
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