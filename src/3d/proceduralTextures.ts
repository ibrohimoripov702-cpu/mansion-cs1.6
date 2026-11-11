import * as THREE from 'three';

/**
 * Creates the authentic Apple iOS 13 Green abstract wallpaper & lock screen texture.
 */
export function createIosWallpaperTexture(
  accentHex: string,
  mode: 'lockscreen' | 'camera' | 'clean' = 'lockscreen',
  isUzbek: boolean = true
): THREE.CanvasTexture {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark elegant deep background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#040d07');
  bgGrad.addColorStop(0.4, '#091c10');
  bgGrad.addColorStop(0.8, '#0d2818');
  bgGrad.addColorStop(1, '#020904');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Iconic iOS 13/15 Green multi-layered abstract glowing ribbons
  const ribbons = [
    { cp1x: 100, cp1y: 400, cp2x: 900, cp2y: 1100, endX: 700, endY: 1900, col: 'rgba(52, 199, 89, 0.45)', width: 180 },
    { cp1x: 900, cp1y: 500, cp2x: 200, cp2y: 1200, endX: 300, endY: 2000, col: 'rgba(48, 209, 88, 0.35)', width: 220 },
    { cp1x: 300, cp1y: 700, cp2x: 800, cp2y: 1400, endX: 500, endY: 2048, col: 'rgba(100, 240, 140, 0.25)', width: 140 },
    { cp1x: 100, cp1y: 900, cp2x: 600, cp2y: 1300, endX: 850, endY: 1800, col: 'rgba(30, 130, 60, 0.5)', width: 260 },
  ];

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const r of ribbons) {
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.endX, r.endY);
    ctx.strokeStyle = r.col;
    ctx.lineWidth = r.width;
    ctx.lineCap = 'round';
    ctx.filter = 'blur(45px)';
    ctx.stroke();
  }
  ctx.restore();

  // Subtle center glow
  const centerGlow = ctx.createRadialGradient(width * 0.55, height * 0.52, 50, width * 0.55, height * 0.52, 500);
  centerGlow.addColorStop(0, 'rgba(70, 220, 110, 0.28)');
  centerGlow.addColorStop(0.7, 'rgba(30, 100, 50, 0.08)');
  centerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  if (mode === 'clean') {
    // Return clean wallpaper with home bar only
    drawHomeBar(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  if (mode === 'camera') {
    // Camera Viewfinder Mode
    drawCameraViewfinder(ctx, width, height, isUzbek);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // 3. Lockscreen UI Overlay (iOS 15 / 16 style)
  ctx.save();
  ctx.fillStyle = '#ffffff';

  // Status Bar Top
  ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText('09:41', 120, 110);

  // Status icons (Cellular, WiFi, Battery)
  drawCellularSignal(ctx, width - 240, 92);
  drawWifiIcon(ctx, width - 180, 92);
  drawBatteryIcon(ctx, width - 110, 85, 0.88);

  // Lock Icon (center)
  drawLockIcon(ctx, width / 2, 190);

  // Date
  ctx.font = '500 44px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  const dateStr = isUzbek ? 'Seshanba, 13-Sentabr' : 'Tuesday, September 13';
  ctx.fillText(dateStr, width / 2, 280);

  // Big Clock "09:41"
  ctx.font = '300 170px -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 18;
  ctx.fillText('09:41', width / 2, 450);
  ctx.shadowBlur = 0;

  // Widget Bar (Weather & Battery)
  drawLockWidgets(ctx, width, height, isUzbek);

  // Notification Card: "Shot on iPhone 13 Green"
  drawNotificationCard(ctx, width, height, isUzbek);

  // Bottom Flashlight & Camera Buttons
  drawQuickActionButton(ctx, 130, height - 240, 'flashlight');
  drawQuickActionButton(ctx, width - 130, height - 240, 'camera');

  // Home Bar Pill
  drawHomeBar(ctx, width, height);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawHomeBar(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const barW = 340;
  const barH = 12;
  const x = (width - barW) / 2;
  const y = height - 50;
  ctx.beginPath();
  ctx.roundRect(x, y, barW, barH, 6);
  ctx.fill();
  ctx.restore();
}

function drawCellularSignal(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  const barWidth = 6;
  const spacing = 4;
  for (let i = 0; i < 4; i++) {
    const h = 10 + i * 6;
    ctx.fillRect(x + i * (barWidth + spacing), y + (28 - h), barWidth, h);
  }
  ctx.restore();
}

function drawWifiIcon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 15, y + 25, 22, Math.PI * 1.25, Math.PI * 1.75);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 15, y + 25, 14, Math.PI * 1.25, Math.PI * 1.75);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + 15, y + 25, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBatteryIcon(ctx: CanvasRenderingContext2D, x: number, y: number, level: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, 60, 28);
  // Battery terminal
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(x + 60, y + 8, 4, 12);
  // Fill
  ctx.fillStyle = '#34C759';
  const innerW = Math.max(4, (60 - 6) * level);
  ctx.fillRect(x + 3, y + 3, innerW, 22);
  ctx.restore();
}

function drawLockIcon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 3.5;
  // Shackle
  ctx.beginPath();
  ctx.arc(x, y - 6, 11, Math.PI, 0);
  ctx.stroke();
  // Body
  ctx.beginPath();
  ctx.roundRect(x - 14, y - 4, 28, 22, 5);
  ctx.fill();
  ctx.restore();
}

function drawLockWidgets(ctx: CanvasRenderingContext2D, width: number, height: number, isUzbek: boolean) {
  ctx.save();
  const y = 520;
  const w = 420;
  const x = (width - w) / 2;

  // Frosted widget pill background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, 80, 24);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 30px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  // Leaf & Green text
  ctx.fillText('🍃 24°C', x + 35, y + 50);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '400 28px -apple-system, sans-serif';
  ctx.fillText(isUzbek ? "Yashil Studiya" : "Green Studio", x + 180, y + 50);
  ctx.restore();
}

function drawNotificationCard(ctx: CanvasRenderingContext2D, width: number, height: number, isUzbek: boolean) {
  ctx.save();
  const cardW = width - 120;
  const cardH = 150;
  const x = 60;
  const y = height * 0.58;

  ctx.fillStyle = 'rgba(20, 35, 25, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, cardH, 32);
  ctx.fill();
  ctx.stroke();

  // App icon badge
  ctx.fillStyle = '#34C759';
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 26, 44, 44, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 26px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('13', x + 46, y + 58);

  // App title
  ctx.textAlign = 'left';
  ctx.font = '600 30px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Apple Event', x + 84, y + 56);

  ctx.font = '400 26px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'right';
  ctx.fillText('hozirgina', x + cardW - 30, y + 56);

  // Message body
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '400 32px -apple-system, sans-serif';
  const text = isUzbek
    ? "iPhone 13 Green: Go'zallik va A15 Bionic kuchi."
    : "iPhone 13 Green: Sophisticated color & A15 power.";
  ctx.fillText(text, x + 26, y + 115);
  ctx.restore();
}

function drawQuickActionButton(ctx: CanvasRenderingContext2D, cx: number, cy: number, type: 'flashlight' | 'camera') {
  ctx.save();
  const radius = 56;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  if (type === 'flashlight') {
    // Torch icon
    ctx.beginPath();
    ctx.roundRect(cx - 10, cy - 8, 20, 26, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy - 24);
    ctx.lineTo(cx + 18, cy - 24);
    ctx.lineTo(cx + 12, cy - 8);
    ctx.lineTo(cx - 12, cy - 8);
    ctx.closePath();
    ctx.fill();
  } else {
    // Camera icon
    ctx.beginPath();
    ctx.roundRect(cx - 20, cy - 12, 40, 28, 6);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx - 8, cy - 18, 16, 6, 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy + 2, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCameraViewfinder(ctx: CanvasRenderingContext2D, width: number, height: number, isUzbek: boolean) {
  ctx.save();
  // Viewfinder UI
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, width, 180);
  ctx.fillRect(0, height - 380, width, 380);

  // Mode picker
  ctx.fillStyle = '#FFCC00';
  ctx.font = '600 30px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FOTO', width / 2, height - 260);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(isUzbek ? 'KINO' : 'CINEMATIC', width / 2 - 200, height - 260);
  ctx.fillText(isUzbek ? 'PORTRET' : 'PORTRAIT', width / 2 + 200, height - 260);

  // Zoom dial: 0.5x, 1x
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;

  // 1x selected
  ctx.beginPath();
  ctx.arc(width / 2 + 35, height - 320, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#FFCC00';
  ctx.font = '600 24px -apple-system, sans-serif';
  ctx.fillText('1x', width / 2 + 35, height - 312);

  // 0.5x
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.arc(width / 2 - 35, height - 320, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 22px -apple-system, sans-serif';
  ctx.fillText('.5', width / 2 - 35, height - 312);

  // Shutter button
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(width / 2, height - 150, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(width / 2, height - 150, 40, 0, Math.PI * 2);
  ctx.fill();

  // Focus brackets in center
  ctx.strokeStyle = 'rgba(255, 204, 0, 0.8)';
  ctx.lineWidth = 3;
  const sz = 120;
  const cx = width / 2;
  const cy = height * 0.45;
  ctx.strokeRect(cx - sz / 2, cy - sz / 2, sz, sz);

  ctx.restore();
}

/**
 * Creates the satin glass backplate texture with the official centered Apple logo.
 */
export function createBackGlassTexture(backHex: string, accentHex: string): THREE.CanvasTexture {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Base satin color
  ctx.fillStyle = backHex;
  ctx.fillRect(0, 0, width, height);

  // 2. Ultra subtle metallic satin gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.04)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 3. Apple Logo centered (authentic Apple geometry)
  const cx = width / 2;
  const cy = height / 2;
  const scale = 1.35;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Shiny mirror inlay effect for the logo
  const logoGrad = ctx.createLinearGradient(-40, -50, 40, 50);
  logoGrad.addColorStop(0, '#ffffff');
  logoGrad.addColorStop(0.4, 'rgba(220, 240, 225, 0.95)');
  logoGrad.addColorStop(0.7, 'rgba(120, 150, 130, 0.85)');
  logoGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = logoGrad;

  // Apple leaf
  ctx.beginPath();
  ctx.moveTo(0, -68);
  ctx.bezierCurveTo(8, -84, 30, -90, 32, -90);
  ctx.bezierCurveTo(32, -90, 32, -68, 14, -58);
  ctx.bezierCurveTo(4, -54, -2, -56, 0, -68);
  ctx.fill();

  // Apple body with bite on right side
  ctx.beginPath();
  ctx.moveTo(0, -42);
  // Top left dip
  ctx.bezierCurveTo(-14, -42, -26, -50, -42, -50);
  ctx.bezierCurveTo(-66, -50, -88, -24, -88, 12);
  ctx.bezierCurveTo(-88, 38, -74, 76, -56, 102);
  ctx.bezierCurveTo(-44, 118, -32, 130, -18, 130);
  ctx.bezierCurveTo(-6, 130, 0, 122, 16, 122);
  ctx.bezierCurveTo(30, 122, 38, 130, 52, 130);
  ctx.bezierCurveTo(68, 130, 80, 116, 90, 102);
  ctx.bezierCurveTo(104, 82, 114, 52, 116, 36);
  // Bite cutout
  ctx.bezierCurveTo(100, 34, 74, 20, 74, -10);
  ctx.bezierCurveTo(74, -38, 98, -50, 106, -54);
  // Top right curve to center dip
  ctx.bezierCurveTo(94, -54, 76, -50, 62, -50);
  ctx.bezierCurveTo(46, -50, 32, -42, 18, -42);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates internal electronics & MagSafe architectural schematic texture for Exploded/X-Ray view.
 */
export function createInternalComponentsTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark matte graphite chassis backplate
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, width, height);

  // PCB Traces (gold & copper bus lines)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 40; i++) {
    const y1 = 200 + i * 40;
    ctx.beginPath();
    ctx.moveTo(100, y1);
    ctx.lineTo(260, y1);
    ctx.lineTo(320, y1 + 30);
    ctx.lineTo(440, y1 + 30);
    ctx.stroke();
  }

  // 1. A15 Bionic Logic Board (Top right)
  const lbX = 520;
  const lbY = 220;
  const lbW = 420;
  const lbH = 580;

  ctx.fillStyle = '#161b22';
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(lbX, lbY, lbW, lbH, 16);
  ctx.fill();
  ctx.stroke();

  // A15 Bionic Heat Spreader
  const chipX = lbX + 70;
  const chipY = lbY + 80;
  const chipW = 260;
  const chipH = 260;
  ctx.fillStyle = '#21262d';
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(chipX, chipY, chipW, chipH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 48px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A15', chipX + chipW / 2, chipY + 115);
  ctx.font = '600 28px -apple-system, sans-serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('BIONIC', chipX + chipW / 2, chipY + 160);
  ctx.font = '400 20px monospace';
  ctx.fillStyle = '#8b949e';
  ctx.fillText('16-CORE NEURAL ENGINE', chipX + chipW / 2, chipY + 205);

  // 2. L-Shaped Lithium-Ion Battery (Apple iPhone 13 signature)
  ctx.fillStyle = '#1c2128';
  ctx.strokeStyle = '#484f58';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // L-shape coordinates
  ctx.moveTo(80, 220);
  ctx.lineTo(480, 220);
  ctx.lineTo(480, 1600);
  ctx.lineTo(80, 1600);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Battery printing text
  ctx.fillStyle = '#8b949e';
  ctx.font = '600 32px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Apple Inc. Rechargeable Li-ion Battery', 120, 320);
  ctx.font = '400 24px monospace';
  ctx.fillText('Model A2653  |  Rated: 3,227 mAh  |  12.41 Wh', 120, 380);
  ctx.fillText('Secondary Li-ion Battery System  |  3.87 Vdc', 120, 420);
  ctx.fillText('Sensor-Shift OIS Power Rails Active', 120, 460);

  // 3. MagSafe Induction Wireless Charging Coil & Neodymium Magnets
  const magX = width / 2;
  const magY = 1060;
  const magRadius = 240;

  // Copper coil spirals
  ctx.strokeStyle = 'rgba(230, 126, 34, 0.75)';
  ctx.lineWidth = 3;
  for (let r = 80; r < 180; r += 8) {
    ctx.beginPath();
    ctx.arc(magX, magY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Neodymium magnet segments ring
  const numMagnets = 18;
  for (let i = 0; i < numMagnets; i++) {
    const angle = (i / numMagnets) * Math.PI * 2;
    const mx = magX + Math.cos(angle) * magRadius;
    const my = magY + Math.sin(angle) * magRadius;
    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = '#8b949e';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.fillRect(-16, -8, 32, 16);
    ctx.strokeRect(-16, -8, 32, 16);
    ctx.restore();
  }

  // 4. Taptic Engine (Bottom right)
  const tapX = 520;
  const tapY = 1620;
  const tapW = 420;
  const tapH = 180;
  ctx.fillStyle = '#21262d';
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(tapX, tapY, tapW, tapH, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 28px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TAPTIC ENGINE', tapX + tapW / 2, tapY + 95);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates the camera lens reflection & anti-reflective coating texture.
 */
export function createCameraLensTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;

  // Deep dark sensor base
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, size, size);

  // Multi-coated glass reflection gradient (Purple / Sapphire / Emerald)
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, size / 2);
  grad.addColorStop(0, '#000000');
  grad.addColorStop(0.4, '#0c1424');
  grad.addColorStop(0.7, '#241238'); // Sapphire purple
  grad.addColorStop(0.9, '#0a3224'); // Emerald edge
  grad.addColorStop(1, '#05070a');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 4, 0, Math.PI * 2);
  ctx.fill();

  // Aperture blades (7-blade iris)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  const numBlades = 7;
  for (let i = 0; i < numBlades; i++) {
    const a = (i / numBlades) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80);
    ctx.lineTo(cx + Math.cos(a + 0.8) * 190, cy + Math.sin(a + 0.8) * 190);
    ctx.stroke();
  }

  // Center sensor dot reflection
  ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(cx + 30, cy - 30, 28, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates soft contact shadow texture for grounding.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
