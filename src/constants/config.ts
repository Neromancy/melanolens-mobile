import { Platform } from 'react-native';

// Ganti IP sesuai jaringan Wi-Fi host untuk HP fisik (misal: 192.168.1.10).
// IP ini dipakai untuk SEMUA platform di dev karena:
//  - HP fisik  : harus pakai IP LAN host yang sama-segmen dengan HP.
//  - Emulator  : Android emulator menjangkau IP LAN host via NAT,
//                 sehingga IP ini juga bekerja (10.0.2.2 hanya alias khusus
//                 emulator, tidak valid di HP fisik).
//  - Web/Chrome: browser di mesin yang sama menjangkau IP ini juga.
// PENTING: request localhost HTTP harus diizinkan (lihat app.json ->
// expo-build-properties usesCleartextTraffic). Expo Go sudah mengizinkan,
// build APK standalone butuh pengaturan tersebut.
const DEV_MACHINE_IP = '192.168.1.13';

export const API_BASE_URL = __DEV__
  ? `http://${DEV_MACHINE_IP}:8000`
  : 'https://api.melanolens.yourdomain.com';