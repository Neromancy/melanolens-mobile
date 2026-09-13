import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { API_BASE_URL } from '../../src/constants/config';
import { useAuthStore } from '../../src/store/useAuthStore';
import { PredictResponse } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const { user, token } = useAuthStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const pickImage = async (fromCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    const res = fromCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!res.canceled && res.assets[0]) {
      setImageUri(res.assets[0].uri);
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!imageUri) return;
    setIsLoading(true);

    const filename = imageUri.split('/').pop() || 'lesi_kulit.jpg';
    const match = /\\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData();
    // RN 0.76+ FormData.getParts() only accepts strings and Blob/File instances.
    // The legacy { uri, name, type } object now throws
    // "Unsupported FormDataPart implementation" on BOTH native and web.
    // Always build a real File from the picked image.
    // expo-file-system's File is a native-backed Blob; appending it to FormData
    // transmits the REAL image bytes. (fetch(uri).blob() + append produced
    // empty/corrupt multipart parts that cv2.imdecode on the backend rejected.)
    formData.append('file', new File(imageUri))
    if (user?.id) {
      formData.append('user_id', String(user.id));
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/skrining/predict`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.status === 'error') {
        throw new Error(data.message || data.detail || 'Gagal memproses analisis citra.');
      }
      setResult(data);
    } catch (err: any) {
      Alert.alert('Kesalahan Analisis', err.message || 'Gagal tersambung ke model AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-lg font-black text-slate-800 mb-1">Skrining Citra Lesi Kulit</Text>
      <Text className="text-xs text-slate-400 mb-4 leading-relaxed">
        Pemeriksaan mandiri klasifikasi melanoma menggunakan Gated MobileNetV2 dan kalkulasi klinis ABCD.
      </Text>

      {/* Image Capture Container */}
      <View className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-5 items-center mb-4">
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-64 h-64 rounded-xl mb-4" resizeMode="cover" />
        ) : (
          <View className="py-8 items-center">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-2">
              <Ionicons name="camera-outline" size={32} color="#2a85ff" />
            </View>
            <Text className="text-xs font-bold text-slate-700">Ambil / Unggah Foto Makro Lesi</Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">Pastikan fokus tajam dan pencahayaan terang</Text>
          </View>
        )}

        <View className="flex-row gap-3 mt-1">
          <TouchableOpacity
            onPress={() => pickImage(true)}
            className="bg-primary px-4 py-2.5 rounded-xl flex-row items-center gap-1.5"
          >
            <Ionicons name="camera" size={16} color="#fff" />
            <Text className="text-white font-bold text-xs">Kamera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(false)}
            className="bg-slate-100 px-4 py-2.5 rounded-xl flex-row items-center gap-1.5"
          >
            <Ionicons name="images" size={16} color="#334155" />
            <Text className="text-slate-700 font-bold text-xs">Galeri</Text>
          </TouchableOpacity>
        </View>
      </View>

      {imageUri && !result && (
        <TouchableOpacity
          onPress={handlePredict}
          disabled={isLoading}
          className="w-full h-12 bg-primary rounded-xl items-center justify-center mb-6"
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-sm">Jalankan Analisis AI</Text>
          )}
        </TouchableOpacity>
      )}

      {/* AI Diagnostic Output */}
      {result && (
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-8 space-y-4">
          <View
            className={`p-3.5 rounded-xl ${
              result.risk_level === 'Tinggi'
                ? 'bg-red-50 border border-red-200'
                : 'bg-emerald-50 border border-emerald-200'
            }`}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-[10px] font-bold text-slate-400 uppercase">
                Diagnosis MobileNetV2
              </Text>
              <Text
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  result.risk_level === 'Tinggi'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                Risiko {result.risk_level}
              </Text>
            </View>
            <Text
              className={`text-base font-black mt-1 ${
                result.risk_level === 'Tinggi' ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {result.label}
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              Confidence Score: {result.confidence.toFixed(1)}% (Jinak: {result.prob_benign}%, Ganas: {result.prob_malignant}%)
            </Text>
          </View>

          {/* Attention Heatmap (XAI) */}
          {result.heatmap_base64 && (
            <View>
              <Text className="text-xs font-bold text-slate-800 mb-1.5">
                Visualisasi Peta Atensi AI (Heatmap)
              </Text>
              <Image
                  source={{
                    uri: result.heatmap_base64.startsWith('data:')
                      ? result.heatmap_base64
                      : `data:image/jpeg;base64,${result.heatmap_base64}`,
                  }}
                  className="w-full h-44 rounded-xl bg-slate-900"
                  resizeMode="contain"
                />
            </View>
          )}

          {/* ABCD Clinical Rules Breakdown */}
          {result.abcd && (
            <View className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs font-bold text-slate-800">Parameter ABCD & TDS</Text>
                <Text className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Skor TDS: {result.abcd.tds}
                </Text>
              </View>
              <View className="flex-row flex-wrap justify-between">
                <View className="w-[48%] bg-white p-2 rounded-lg mb-2 border border-slate-100">
                  <Text className="text-[10px] text-slate-400">A - Asimetri</Text>
                  <Text className="text-xs font-bold text-slate-700">{result.abcd.a_score} / 2</Text>
                </View>
                <View className="w-[48%] bg-white p-2 rounded-lg mb-2 border border-slate-100">
                  <Text className="text-[10px] text-slate-400">B - Pinggiran</Text>
                  <Text className="text-xs font-bold text-slate-700">{result.abcd.b_score} / 8</Text>
                </View>
                <View className="w-[48%] bg-white p-2 rounded-lg border border-slate-100">
                  <Text className="text-[10px] text-slate-400">C - Warna</Text>
                  <Text className="text-xs font-bold text-slate-700">{result.abcd.c_score} ragam</Text>
                </View>
                <View className="w-[48%] bg-white p-2 rounded-lg border border-slate-100">
                  <Text className="text-[10px] text-slate-400">D - Diameter</Text>
                  <Text className="text-xs font-bold text-slate-700">{result.abcd.diameter_mm} mm</Text>
                </View>
              </View>
              <Text className="text-[10px] text-slate-400 mt-2">
                Kesesuaian AI-Klinis: <Text className="font-bold text-primary">{result.abcd.concordance}</Text>
              </Text>
            </View>
          )}

          <View className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Text className="text-xs font-bold text-slate-800 mb-1">Rekomendasi Medis:</Text>
            <Text className="text-xs text-slate-600 leading-relaxed">{result.recommendation}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}