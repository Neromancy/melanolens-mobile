export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  pekerjaan?: string;
}

export interface ABCDResult {
  a_score: number;
  b_score: number;
  c_score: number;
  d_score: number;
  diameter_mm: number;
  detected_colors: string[];
  tds: number;
  clinical_category?: string;
  clinical_risk_level?: string;
  concordance: string;
}

export interface PredictResponse {
  status?: string;
  message?: string;
  label: string;
  english_label: string;
  confidence: number;
  prob_benign: number;
  prob_malignant: number;
  risk_level: string;
  color?: string;
  recommendation: string;
  heatmap_base64?: string;
  scan_id?: number;
  abcd?: ABCDResult;
}

export interface ScanHistoryItem {
  scan_id: number;
  user_id: number;
  scan_gambar: string;
  scan_tanggal: string;
  scan_persentase: number;
  scan_respon: string;
}