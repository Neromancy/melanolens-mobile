import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

const DOT_STYLE = { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: '#cbd5e1' };
const ROW_STYLE = { flexDirection: 'row' as const, justifyContent: 'space-between' as const };
const DOTTED_CONTAINER_STYLE = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'space-between' as const,
  paddingVertical: 10,
  paddingHorizontal: 14,
  opacity: 0.45,
};

function DottedBackground() {
  return (
    <View pointerEvents="none" style={DOTTED_CONTAINER_STYLE}>
      {Array.from({ length: 6 }).map((_, r) => (
        <View key={`r-${r}`} style={ROW_STYLE}>
          {Array.from({ length: 8 }).map((_, c) => (
            <View key={`d-${r}-${c}`} style={DOT_STYLE} />
          ))}
        </View>
      ))}
    </View>
  );
}

const GUIDE_STEPS = [
  {
    number: '1',
    title: 'Registrasi & Login',
    desc: 'Masuk ke dalam sistem menggunakan akun Google yang sudah terintegrasi aman lewat fitur Split-Screen Authentication.',
  },
  {
    number: '2',
    title: 'Unggah Citra Lesi',
    desc: 'Unggah citra lesi kulit yang ingin dianalisis menggunakan fitur unggah gambar yang tersedia.',
  },
  {
    number: '3',
    title: 'Ekstraksi Medis ABCDE',
    desc: 'Sistem Computer Vision akan otomatis menganalisis karakteristik fisik lesi berdasarkan parameter ketidaksimetrisan, pinggiran, warna, dan diameter.',
  },
  {
    number: '4',
    title: 'Cek Peta Atensi AI',
    desc: 'Lihat visualisasi Attention Maps (Heatmap) untuk mengetahui area interpretasi model Deep Learning yang menjadi dasar keputusan sistem.',
  },
  {
    number: '5',
    title: 'Unduh Laporan Medis',
    desc: 'Dapatkan hasil kalkulasi skor probabilitas akhir dan simpan riwayat skrining ke dashboard untuk pemantauan perkembangan lesi secara berkala.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Apa itu metode ABCDE?',
    answer:
      'Metode standardisasi klinis internasional untuk memeriksa karakteristik lesi kulit berdasarkan Asimetri, Pinggiran, Warna, Diameter, dan Perkembangannya.',
  },
  {
    question: 'Apakah aplikasi ini bisa menggantikan dokter spesialis?',
    answer:
      'Tidak. MelanoLens dirancang sebagai alat penapisan awal (early screening) dan asisten medis objektif, bukan alat diagnosis mutlak pengganti dokter spesialis kulit.',
  },
  {
    question: 'Seberapa akurat analisis parameter medis ini?',
    answer:
      'Sistem mengekstrak karakteristik fisik lesi jaringan secara kuantitatif berdasarkan bobot fitur citra dermoskopi yang diunggah pengguna.',
  },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      contentContainerStyle={{ paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
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

      <View className="mt-2 mb-6 items-start px-2">
        <Text className="text-2xl font-extrabold text-slate-900 text-left tracking-tight leading-tight">
          Fitur Unggulan MelanoLens
        </Text>
        <Text className="text-xs text-slate-500 text-left mt-3 leading-relaxed max-w-[320px]">
          Platform cerdas yang mengintegrasikan kecerdasan buatan dengan standardisasi medis internasional demi penapisan yang objektif
        </Text>
      </View>

      <View className="gap-5 mb-6">
        <View className="bg-white rounded-3xl p-4 border border-slate-200/70 shadow-sm">
          <View className="relative bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden py-3 px-3.5 items-center justify-center">
            <DottedBackground />
            <View className="w-full max-w-[260px] bg-white p-1 rounded-xl shadow-xs border border-slate-100/90 mb-2 overflow-hidden">
              <Image
                source={require('../../assets/hasilscan.webp')}
                style={{ width: '100%', height: 48, borderRadius: 6 }}
                resizeMode="contain"
              />
            </View>
            <View className="w-full max-w-[260px] bg-white p-1 rounded-xl shadow-xs border border-slate-100/90 overflow-hidden">
              <Image
                source={require('../../assets/hasilscan2.webp')}
                style={{ width: '100%', height: 48, borderRadius: 6 }}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text className="text-base font-extrabold text-slate-900 mt-4 mb-1.5">
            Standardisasi Medis ABCDE
          </Text>
          <Text className="text-xs text-slate-500 leading-relaxed">
            Analisis citra kulit dilakukan secara terstruktur berdasarkan parameter klinis Asymmetry, Border, Color, Diameter, dan Evolving untuk hasil penapisan awal yang komprehensif.
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-4 border border-slate-200/70 shadow-sm">
          <View className="relative bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden py-3 px-3.5 items-center justify-center">
            <DottedBackground />
            <View className="bg-white p-1 rounded-2xl shadow-xs border border-slate-100/90 overflow-hidden" style={{ width: 175, height: 118 }}>
              <Image
                source={require('../../assets/heatmap.webp')}
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
          </View>

          <Text className="text-base font-extrabold text-slate-900 mt-4 mb-1.5">
            Transparansi AI (Explainable AI)
          </Text>
          <Text className="text-xs text-slate-500 leading-relaxed">
            Tidak hanya memberikan hasil probabilitas, sistem kami menyediakan visualisasi Attention Maps (Heatmap) untuk menunjukkan area lesi kulit yang menjadi dasar keputusan model AI.
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-4 border border-slate-200/70 shadow-sm">
          <View className="relative bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden py-3 px-3.5 items-center justify-center">
            <DottedBackground />
            <View className="flex-row gap-3 mb-2.5">
              <View className="bg-white rounded-xl border border-slate-100/90 shadow-xs items-center justify-center" style={{ width: 54, height: 54 }}>
                <Ionicons name="image-outline" size={24} color="#5865f2" />
              </View>
              <View className="bg-white rounded-xl border border-slate-100/90 shadow-xs items-center justify-center" style={{ width: 54, height: 54 }}>
                <Ionicons name="ribbon-outline" size={24} color="#5865f2" />
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="bg-white rounded-xl border border-slate-100/90 shadow-xs items-center justify-center" style={{ width: 54, height: 54 }}>
                <Ionicons name="warning-outline" size={24} color="#5865f2" />
              </View>
              <View className="bg-white rounded-xl border border-slate-100/90 shadow-xs items-center justify-center" style={{ width: 54, height: 54 }}>
                <Ionicons name="calendar-number-outline" size={24} color="#5865f2" />
              </View>
            </View>
          </View>

          <Text className="text-base font-extrabold text-slate-900 mt-4 mb-1.5">
            Integrasi Antarmuka Responsif
          </Text>
          <Text className="text-xs text-slate-500 leading-relaxed">
            Dioptimalkan dengan arsitektur komponen modern yang responsif untuk berbagai perangkat, memudahkan akses penapisan baik melalui desktop di klinik maupun perangkat <Text style={{ fontStyle: 'italic' }}>mobile</Text>.
          </Text>
        </View>
      </View>

      <View className="bg-primary rounded-3xl p-5 mb-8 shadow-sm">
        <View className="mb-5">
          <Text className="text-2xl font-extrabold text-white tracking-tight leading-tight">
            Panduan Penggunaan MelanoLens
          </Text>
          <Text className="text-xs text-white/90 mt-2 leading-relaxed">
            Ikuti langkah-langkah mudah berikut untuk mulai melakukan penapisan awal risiko melanoma secara mandiri dan objektif.
          </Text>
        </View>

        <View className="gap-3.5">
          {GUIDE_STEPS.map((step) => (
            <View key={step.number} className="bg-white rounded-2xl p-4 shadow-xs">
              <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mb-3">
                <Text className="text-primary font-black text-base">{step.number}</Text>
              </View>
              <Text className="text-sm font-extrabold text-slate-900 mb-1">
                {step.title}
              </Text>
              <Text className="text-xs text-slate-500 leading-relaxed">
                {step.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-2 mb-6 items-start px-2">
        <Text className="text-2xl font-extrabold text-slate-900 text-left tracking-tight leading-tight">
          Pertanyaan yang Sering Diajukan (FAQ)
        </Text>
        <Text className="text-xs text-slate-500 text-left mt-2 leading-relaxed">
          Temukan jawaban seputar teknologi penapisan, standardisasi medis, dan cara kerja platform asisten medis MelanoLens.
        </Text>
      </View>

      <View className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-sm mb-8">
        <Text className="text-lg font-extrabold text-slate-900 mb-1.5">
          Seputar Metode Penapisan Medis
        </Text>
        <Text className="text-xs text-slate-500 leading-relaxed mb-4">
          Berikut adalah penjelasan singkat mengenai landasan medis yang digunakan oleh sistem kecerdasan buatan MelanoLens dalam mendeteksi gejala melanoma.
        </Text>

        <View className="bg-slate-50/70 rounded-2xl border border-slate-100 py-3 px-2 mb-4 items-center justify-center overflow-hidden">
          <Image
            source={require('../../assets/melanoma.png')}
            style={{ width: 180, height: 320, borderRadius: 12 }}
            resizeMode="contain"
          />
        </View>

        <View className="gap-2.5">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setOpenFaq(isOpen ? null : idx)}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-bold text-slate-800 flex-1 pr-3 leading-snug">
                    Q: {faq.question}
                  </Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#2a85ff"
                  />
                </View>
                {isOpen && (
                  <View className="mt-2.5 pt-2.5 border-t border-slate-200/60">
                    <Text className="text-xs text-slate-600 leading-relaxed">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
