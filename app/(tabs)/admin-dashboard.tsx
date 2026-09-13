import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../src/constants/config';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

interface DashboardStats {
  summary?: {
    weekly_scan?: number;
    weekly_malignant?: number;
    weekly_benign?: number;
    monthly_scan?: number;
    yearly_scan?: number;
    yearly_malignant?: number;
    yearly_benign?: number;
    avg_confidence?: number;
  };
  charts?: {
    weekly_scan?: number[];
    weekly_malignant?: number[];
    weekly_benign?: number[];
    monthly_scan?: number[];
    monthly_malignant?: number[];
    monthly_benign?: number[];
    yearly_scan?: number[];
    yearly_malignant?: number[];
    yearly_benign?: number[];
  };
  gender_demographic?: { id: string; name: string; value: number; count: number }[];
  age_demographic?: {
    percentage?: { young?: number; product?: number; elderly?: number };
    counts?: { young?: number; product?: number; elderly?: number };
  };
  diagnosis_summary?: { id: string; name: string; sales: number }[];
  recent_scans?: {
    scan_id: number;
    user_nama: string;
    scan_tanggal: string;
    scan_respon: string;
    scan_persentase: number;
  }[];
}

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const QUARTERS = ['1', '2', '3', '4'];

export default function AdminDashboardScreen() {
  const token = useAuthStore((s) => s.token);
  const userRole = useAuthStore((s) => s.user?.role);
  const isAdmin = userRole === 'admin';
  const router = useRouter();
  // Guard: only admins may render this screen. Non-admins bounce to Home.
  useEffect(() => {
    if (!isAdmin) router.replace('/(tabs)');
  }, [isAdmin, router]);
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.warn('Gagal memuat statistik admin:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin) fetchStats();
    else setLoading(false);
  }, [isAdmin, fetchStats]);

  const s = data?.summary || {};
  const charts = data?.charts || {};
  const agePct = data?.age_demographic?.percentage || {};
  const ageCnt = data?.age_demographic?.counts || {};

  const maxOf = (arr: number[] = []) => Math.max(1, ...arr);

  if (!isAdmin) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2a85ff" />
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />
      }
    >
      {loading ? (
        <View className="flex-1 justify-center items-center py-32">
          <ActivityIndicator size="large" color="#2a85ff" />
        </View>
      ) : (
        <>
          <Text className="text-lg font-black text-slate-800 mb-1">Dashboard Admin</Text>
          <Text className="text-xs text-slate-400 mb-4">Statistik & Rekam Medis seluruh pasien</Text>

          {/* Summary cards */}
          <View className="flex-row flex-wrap gap-3 mb-5">
            <SummaryCard icon="pulse" color="#2a85ff" label="Total Berkas" value={String(s.yearly_scan ?? 0)} />
            <SummaryCard icon="warning" color="#ef4444" label="Ganas" value={String(s.yearly_malignant ?? 0)} />
            <SummaryCard icon="checkmark-circle" color="#10b981" label="Jinak" value={String(s.yearly_benign ?? 0)} />
            <SummaryCard icon="speedometer" color="#8b5cf6" label="Avg. Keyakinan" value={`${Number(s.avg_confidence ?? 0).toFixed(1)}%`} />
          </View>

          {/* Volume this week */}
          <Card title="Volume Pemeriksaan (Minggu Ini)">
            <View className="flex-row gap-1 items-end h-32">
              {charts.weekly_scan?.map((v, i) => (
                <View key={i} className="flex-1 items-center gap-1">
                  <Text className="text-[9px] font-bold text-slate-500">{v}</Text>
                  <View
                    className={`w-full rounded-t-md ${charts.weekly_malignant?.[i] ? (v > 0 ? 'bg-red-400' : 'bg-slate-200') : 'bg-slate-200'}`}
                    style={{ height: `${Math.max(6, (v / maxOf(charts.weekly_scan)) * 100)}%`, minHeight: 6 }}
                  />
                  <Text className="text-[9px] text-slate-400">{DAYS[i]}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Diagnosis summary */}
          {!!data?.diagnosis_summary?.length && (
            <Card title="Ringkasan Diagnosis">
              {data.diagnosis_summary.map((d, i) => (
                <View key={d.id} className="flex-row justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <Text className="text-xs text-slate-600">{d.name}</Text>
                  <Text className={`text-xs font-extrabold ${i === 0 ? 'text-red-500' : 'text-emerald-600'}`}>{d.sales} Berkas</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Demographics */}
          <View className="flex-row gap-3 mb-5">
            <Card title="Jenis Kelamin" containerClass="flex-1">
              {(data?.gender_demographic || []).map((g) => (
                <View key={g.id} className="mb-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-[10px] text-slate-500">{g.name}</Text>
                    <Text className="text-[10px] font-bold text-slate-700">{g.value}%</Text>
                  </View>
                  <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-primary rounded-full" style={{ width: `${g.value}%` }} />
                  </View>
                </View>
              ))}
            </Card>
            <Card title="Usia" containerClass="flex-1">
              {[
                { label: '<25 (Muda)', pct: agePct.young ?? 0 },
                { label: '25-50 (Produktif)', pct: agePct.product ?? 0 },
                { label: '>50 (Lansia)', pct: agePct.elderly ?? 0 },
              ].map((a, i) => (
                <View key={i} className="mb-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-[9px] text-slate-500">{a.label}</Text>
                    <Text className="text-[10px] font-bold text-slate-700">{a.pct}%</Text>
                  </View>
                  <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-violet-500 rounded-full" style={{ width: `${a.pct}%` }} />
                  </View>
                </View>
              ))}
            </Card>
          </View>

          {/* Recent scans -> Berkas */}
          <Card title="Pemeriksaan Terbaru">
            {(data?.recent_scans || []).slice(0, 5).map((r) => (
              <TouchableOpacity
                key={r.scan_id}
                onPress={() => router.push('/(tabs)/admin-berkas')}
                className="flex-row items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
              >
                <View className="flex-1">
                  <Text className="text-xs font-bold text-slate-800 capitalize">{r.user_nama}</Text>
                  <Text className="text-[10px] text-slate-400">{r.scan_tanggal}</Text>
                </View>
                <Text className={`text-xs font-extrabold ${/melanoma|ganas/i.test(r.scan_respon || '') ? 'text-red-500' : 'text-emerald-600'}`}>
                  {(r.scan_persentase * 100).toFixed(1)}%
                </Text>
              </TouchableOpacity>
            ))}
            {!data?.recent_scans?.length && <Text className="text-xs text-slate-400 py-3">Belum ada pemeriksaan.</Text>}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/admin-berkas')}
              className="mt-3 bg-primary py-2.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-xs">Lihat Semua Berkas →</Text>
            </TouchableOpacity>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

function SummaryCard({ icon, color, label, value }: { icon: any; color: string; label: string; value: string }) {
  return (
    <View className="w-[48%] bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${color}1a` }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-black text-slate-800">{value}</Text>
        <Text className="text-[10px] text-slate-400">{label}</Text>
      </View>
    </View>
  );
}

function Card({ title, children, containerClass }: { title: string; children: React.ReactNode; containerClass?: string }) {
  return (
    <View className={`bg-white p-4 rounded-2xl border border-slate-100 mb-5 ${containerClass || ''}`}>
      <Text className="text-xs font-bold text-slate-800 mb-3">{title}</Text>
      {children}
    </View>
  );
}