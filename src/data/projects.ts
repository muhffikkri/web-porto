export type Project = {
  id: string;
  title: string;
  description: string;
  /** Longer text shown in the project's detail view. Falls back to description. */
  detail?: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    "id": "ecg-wearable-evaluation",
    "title": "Ecg Wearable Evaluation",
    "description": "Repo untuk evaluasi akuisisi sinyal pada penggunaan wearable ECG",
    "tags": [],
    "github": "https://github.com/muhffikkri/ecg-wearable-evaluation",
    "image": "ecg-wearable-evaluation.png"
  },
  {
    "id": "ecg-wave-preprocess",
    "title": "Ecg Wave Preprocess",
    "description": "Web workbench untuk memproses, memvisualisasikan, dan menguji sinyal Elektrokardiogram (EKG)",
    "tags": [],
    "github": "https://github.com/muhffikkri/ecg-wave-preprocess",
    "image": "ecg-wave-preprocess-tab1.png"
  },
  {
    "id": "Snake-Identification-web",
    "title": "Snake Identification Web",
    "description": "Sistem identifikasi dan monitoring gigitan ular yang terintegrasi ",
    "tags": [],
    "github": "https://github.com/muhffikkri/Snake-Identification-web",
    "image": "snakebiteai.png"
  },
  {
    "id": "room-reservation-system",
    "title": "Room Reservation System",
    "description": "Sistem informasi untuk reservasi ruangan di kampus",
    "tags": [],
    "github": "https://github.com/muhffikkri/room-reservation-system",
    "image": "room-reservation-system.png"
  },
  {
    "id": "jara-advanced-todo-list",
    "title": "Jara Advanced Todo List",
    "description": "Todo List APP Praktikum PPK",
    "tags": [],
    "github": "https://github.com/muhffikkri/jara-advanced-todo-list",
    "image": "jara-advanced-todo-list.png"
  },
  {
    "id": "algorithm-comparation-rob-evacuation-routing",
    "title": "Algorithm Comparation Rob Evacuation Routing",
    "description": "Tugas Besar Analisis dan Strategi Algoritma - Analisis Komparatif algoritma pada evakuasi banjir",
    "tags": [],
    "github": "https://github.com/muhffikkri/algorithm-comparation-rob-evacuation-routing"
  },
  {
    "id": "sea-level-anomaly-convlstm",
    "title": "Sea Level Anomaly Convlstm",
    "description": "Documentation of paper entitled ConvLSTM-Based Spatio-Temporal Forecasting of Coastal Sea Level Extremes in Tropical Regions",
    "tags": [],
    "github": "https://github.com/muhffikkri/sea-level-anomaly-convlstm"
  },
  {
    "id": "ecg-edge-ai-engine",
    "title": "Ecg Edge Ai Engine",
    "description": "Lightweight ECG inference engine featuring configurable signal preprocessing, TensorFlow Lite models, and black-box deployment for edge computing applications.",
    "tags": [],
    "github": "https://github.com/muhffikkri/ecg-edge-ai-engine"
  }
];

