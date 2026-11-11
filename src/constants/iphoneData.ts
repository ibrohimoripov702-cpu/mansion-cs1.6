import { ColorVariant, LightingPreset, CameraPreset } from '../types/iphone';

// Authentic iPhone 13 dimensions scaled for 3D view (approx 1:20 scale)
// Real: 146.7mm x 71.5mm x 7.65mm
export const IPHONE_DIMENSIONS = {
  width: 3.58,   // X
  height: 7.33,  // Y
  depth: 0.384,  // Z
  cornerRadius: 0.52,
  bezelWidth: 0.14,
  notchWidth: 1.15,
  notchHeight: 0.28,
  bumpSize: 1.55,
  bumpDepth: 0.08,
  lensRadius: 0.42,
  lensDepth: 0.11,
};

export const COLOR_VARIANTS: ColorVariant[] = [
  {
    id: 'green',
    name: 'Green',
    nameUz: 'Yashil (Green)',
    hex: '#2E3D34',
    backHex: '#2E3D34',
    frameHex: '#38483E',
    accentHex: '#4E6857',
    cameraBumpHex: '#26332B',
    metalness: 0.35,
    roughness: 0.28,
    description: 'Apple signature rich forest green finish introduced with iPhone 13.',
    descriptionUz: "iPhone 13 uchun chiqarilgan rasmiy to'q o'rmon yashil rangi.",
  },
  {
    id: 'midnight',
    name: 'Midnight',
    nameUz: 'Tungi qora (Midnight)',
    hex: '#1F242B',
    backHex: '#1C2128',
    frameHex: '#222933',
    accentHex: '#384454',
    cameraBumpHex: '#181D23',
    metalness: 0.4,
    roughness: 0.25,
    description: 'Deep navy-tinted black finish.',
    descriptionUz: "To'q ko'k tusli qora rang.",
  },
  {
    id: 'starlight',
    name: 'Starlight',
    nameUz: 'Yulduz nuri (Starlight)',
    hex: '#F0EBE3',
    backHex: '#F6F3EE',
    frameHex: '#E2DCD5',
    accentHex: '#FAF8F5',
    cameraBumpHex: '#EAE4DC',
    metalness: 0.45,
    roughness: 0.2,
    description: 'Warm, luminous champagne silver tone.',
    descriptionUz: "Iliq, yorqin shampan kumush rangi.",
  },
  {
    id: 'blue',
    name: 'Blue',
    nameUz: "Ko'k (Blue)",
    hex: '#275270',
    backHex: '#295473',
    frameHex: '#306286',
    accentHex: '#4584B0',
    cameraBumpHex: '#20455F',
    metalness: 0.35,
    roughness: 0.26,
    description: 'Vibrant oceanic blue satin finish.',
    descriptionUz: "Jonli okean moviy saten qoplama.",
  },
  {
    id: 'pink',
    name: 'Pink',
    nameUz: 'Pushti (Pink)',
    hex: '#F8D8D8',
    backHex: '#FCE7E6',
    frameHex: '#E8B6B5',
    accentHex: '#FFF0F0',
    cameraBumpHex: '#F3CDCD',
    metalness: 0.3,
    roughness: 0.25,
    description: 'Soft pastel blush pink with satin glass.',
    descriptionUz: 'Yumshoq pastel och pushti rang.',
  },
  {
    id: 'red',
    name: '(PRODUCT)RED',
    nameUz: '(PRODUCT)RED Qizil',
    hex: '#BA0C2F',
    backHex: '#BF0D32',
    frameHex: '#9E0A27',
    accentHex: '#E61940',
    cameraBumpHex: '#A30B29',
    metalness: 0.35,
    roughness: 0.22,
    description: 'Striking bold ruby red finish.',
    descriptionUz: "Yorqin qizil rangli shisha va metall korpus.",
  },
];

export const CAMERA_PRESETS: { id: CameraPreset; label: string; labelUz: string; position: [number, number, number]; target: [number, number, number] }[] = [
  { id: 'hero', label: 'Beauty 3/4', labelUz: '3/4 Go\'zallik', position: [3.8, 2.2, 7.5], target: [0, 0, 0] },
  { id: 'front', label: 'Front Display', labelUz: 'Old Ekran', position: [0, 0, 9.2], target: [0, 0, 0] },
  { id: 'back', label: 'Back View', labelUz: 'Orqa Tomon', position: [0, 0, -9.2], target: [0, 0, 0] },
  { id: 'camera_bump', label: 'Dual Camera', labelUz: 'Diagonal Kamera', position: [-1.4, 2.1, -4.6], target: [-0.85, 2.3, -0.2] },
  { id: 'profile', label: 'Slim Profile', labelUz: 'Yon Tomon', position: [7.8, 0.4, 0.2], target: [0, 0, 0] },
  { id: 'bottom', label: 'Ports & Speakers', labelUz: 'Pastki Portlar', position: [0.2, -6.8, 4.2], target: [0, -3.5, 0] },
];

export const LIGHTING_PRESETS: { id: LightingPreset; label: string; labelUz: string; icon: string }[] = [
  { id: 'studio', label: 'Apple Studio', labelUz: 'Apple Studiya', icon: 'Sparkles' },
  { id: 'dark', label: 'Dark Keynote', labelUz: 'Qorong\'u Taqdimot', icon: 'Moon' },
  { id: 'bright', label: 'Pure Showroom', labelUz: 'Yorug\' Ko\'rgazma', icon: 'Sun' },
  { id: 'cyber', label: 'Emerald Glow', labelUz: 'Zumrad Nuri', icon: 'Zap' },
];

export const SPECIFICATIONS = {
  title: 'Apple iPhone 13 (Green)',
  titleUz: 'Apple iPhone 13 (Yashil)',
  releaseDate: 'March 2022 (Green Edition) / September 2021',
  releaseDateUz: '2022 yil Mart (Yashil versiya) / 2021 Sentyabr',
  items: [
    {
      category: 'Design & Materials',
      categoryUz: 'Dizayn va Materiallar',
      details: [
        { label: 'Color', labelUz: 'Rangi', value: 'Pine Green / Yashil (Satin matte back glass)', valueUz: "To'q ignabargli yashil (Mat shisha)" },
        { label: 'Dimensions', labelUz: "O'lchamlari", value: '146.7 × 71.5 × 7.65 mm', valueUz: '146.7 × 71.5 × 7.65 mm' },
        { label: 'Weight', labelUz: 'Vazni', value: '174 grams (6.14 oz)', valueUz: '174 gramm' },
        { label: 'Materials', labelUz: 'Materiallar', value: 'Ceramic Shield front, Glass back, Aerospace-grade Aluminum edges', valueUz: 'Ceramic Shield old oyna, shisha orqa panel, aerokosmik alyuminiy rom' },
        { label: 'Water Resistance', labelUz: 'Suvga chidamlilik', value: 'IP68 (6 meters up to 30 mins, IEC 60529)', valueUz: "IP68 (6 metr chuqurlikda 30 daqiqagacha)" },
      ],
    },
    {
      category: 'Display',
      categoryUz: 'Displey',
      details: [
        { label: 'Screen Type', labelUz: 'Ekran turi', value: 'Super Retina XDR OLED', valueUz: 'Super Retina XDR OLED' },
        { label: 'Size & Resolution', labelUz: "Hajm va Aniqlik", value: '6.1-inch, 2532 × 1170 pixels (460 ppi)', valueUz: '6.1 dyuym, 2532 × 1170 piksel (460 ppi)' },
        { label: 'Brightness', labelUz: 'Yorqinlik', value: '800 nits typical, 1200 nits peak HDR', valueUz: '800 nit odatiy, 1200 nit HDR cho\'qqi' },
        { label: 'True Tone & Wide Color', labelUz: 'Ranglar', value: 'P3 wide color gamut, HDR display, True Tone', valueUz: "P3 keng rang qamrovi, HDR10, True Tone" },
        { label: 'Notch', labelUz: 'Tirqish (Notch)', value: '20% smaller FaceID notch compared to iPhone 12', valueUz: "iPhone 12 ga nisbatan 20% kichraytirilgan Face ID" },
      ],
    },
    {
      category: 'Dual Camera System',
      categoryUz: 'Ikkitalik Kamera Tizimi',
      details: [
        { label: 'Layout', labelUz: 'Joylashuv', value: 'Iconic 45° diagonal arrangement', valueUz: "Mashhur 45 darajali diagonal joylashuv" },
        { label: 'Main Wide Lens', labelUz: 'Asosiy Keng Ob\'yektiv', value: '12 MP, f/1.6, 26mm, 100% Focus Pixels, Sensor-shift OIS', valueUz: '12 MP, f/1.6, 26mm, Matritsali optik barqarorlashtirish (Sensor-shift OIS)' },
        { label: 'Ultra Wide Lens', labelUz: 'Ultra-keng Ob\'yektiv', value: '12 MP, f/2.4, 13mm, 120° field of view, 5-element lens', valueUz: "12 MP, f/2.4, 13mm, 120° ko'rish burchagi" },
        { label: 'Cinematic Mode', labelUz: 'Kinematografik Rejim', value: '1080p at 30 fps with shallow depth of field & auto focus racking', valueUz: "Kino rejimi (1080p 30 kadr/s) orqa fonni xiralashtirish bilan" },
        { label: 'Photographic Styles', labelUz: 'Surat Uslublari', value: 'Rich Contrast, Vibrant, Warm, Cool customizable profiles', valueUz: 'Boy kontrast, Jonli, Iliq, Salqin uslublar' },
      ],
    },
    {
      category: 'Performance & Battery',
      categoryUz: 'Unumdorlik va Batareya',
      details: [
        { label: 'Chipset', labelUz: 'Protsessor', value: 'Apple A15 Bionic (5nm, 6-core CPU, 4-core GPU, 16-core NPU)', valueUz: 'Apple A15 Bionic (5nm, 6 yadroli CPU, 4 yadroli GPU, 16 yadroli Neural Engine)' },
        { label: 'Battery Capacity', labelUz: 'Batareya Sig\'imi', value: '3,227 mAh (up to 19 hours video playback)', valueUz: '3,227 mA·s (19 soatgacha video ko\'rish)' },
        { label: 'Charging', labelUz: 'Zaryadlash', value: 'MagSafe wireless up to 15W, Qi wireless up to 7.5W, 20W wired fast charge', valueUz: "15W MagSafe simsiz, 20W tez zaryadlash" },
        { label: 'Connectivity', labelUz: 'Aloqa', value: '5G (sub-6 GHz), Wi-Fi 6 (802.11ax), Bluetooth 5.0, Ultra Wideband (U1)', valueUz: '5G, Wi-Fi 6, Bluetooth 5.0, U1 chip' },
      ],
    },
  ],
};
