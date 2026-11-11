import * as THREE from 'three';

// Procedural Canvas Textures for Counter-Strike 1.6 cs_mansion
// Zero external 404 dependencies

/**
 * Classic yellow/tan mansion brick texture
 */
export function createBrickTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base mortar
  ctx.fillStyle = '#6e6559';
  ctx.fillRect(0, 0, size, size);

  // Brick rows
  const rows = 16;
  const cols = 8;
  const rowHeight = size / rows;
  const colWidth = size / (cols / 2);

  for (let r = 0; r < rows; r++) {
    const isOffset = r % 2 === 1;
    const startX = isOffset ? -colWidth / 2 : 0;
    for (let c = startX; c < size + colWidth; c += colWidth) {
      // Brick color variations (ochre, sandy beige, rustic orange)
      const tone = Math.random() * 25;
      const red = Math.floor(190 + tone);
      const green = Math.floor(155 + tone * 0.8);
      const blue = Math.floor(115 + tone * 0.5);

      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(c + 2, r * rowHeight + 2, colWidth - 4, rowHeight - 4);

      // Micro-texture noise on brick
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let n = 0; n < 20; n++) {
        const nx = c + 4 + Math.random() * (colWidth - 8);
        const ny = r * rowHeight + 4 + Math.random() * (rowHeight - 8);
        ctx.fillRect(nx, ny, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Iconic CS 1.6 Wooden Crate Texture
 */
export function createWoodCrateTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base wood tone
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(0, 0, size, size);

  // Vertical wood planks
  const numPlanks = 6;
  const plankW = size / numPlanks;
  for (let i = 0; i < numPlanks; i++) {
    const shade = (i % 2 === 0 ? 1 : 0.9) + (Math.random() * 0.15 - 0.07);
    ctx.fillStyle = `rgb(${Math.floor(145 * shade)}, ${Math.floor(95 * shade)}, ${Math.floor(48 * shade)})`;
    ctx.fillRect(i * plankW, 0, plankW, size);

    // Plank seam
    ctx.fillStyle = '#4a2d12';
    ctx.fillRect(i * plankW, 0, 4, size);
  }

  // Cross diagonal wooden braces
  ctx.fillStyle = '#7a4e25';
  ctx.strokeStyle = '#4a2d12';
  ctx.lineWidth = 4;

  // Diagonal 1
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.lineTo(size - 30, size);
  ctx.lineTo(0, 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Diagonal 2
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(0, size - 30);
  ctx.lineTo(size - 30, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Outer border frame
  const border = 36;
  ctx.fillStyle = '#6b4420';
  ctx.fillRect(0, 0, size, border);
  ctx.fillRect(0, size - border, size, border);
  ctx.fillRect(0, 0, border, size);
  ctx.fillRect(size - border, 0, border, size);

  // Metal corner brackets
  ctx.fillStyle = '#3a3a3a';
  const bracketSize = 75;
  // 4 corners
  ctx.fillRect(0, 0, bracketSize, 18);
  ctx.fillRect(0, 0, 18, bracketSize);

  ctx.fillRect(size - bracketSize, 0, bracketSize, 18);
  ctx.fillRect(size - 18, 0, 18, bracketSize);

  ctx.fillRect(0, size - 18, bracketSize, 18);
  ctx.fillRect(0, size - bracketSize, 18, bracketSize);

  ctx.fillRect(size - bracketSize, size - 18, bracketSize, 18);
  ctx.fillRect(size - 18, size - bracketSize, 18, bracketSize);

  // Rivets on metal brackets
  ctx.fillStyle = '#cccccc';
  const rivet = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  };
  rivet(9, 9);
  rivet(45, 9);
  rivet(9, 45);
  rivet(size - 9, 9);
  rivet(size - 45, 9);
  rivet(size - 9, 45);
  rivet(9, size - 9);
  rivet(45, size - 9);
  rivet(9, size - 45);
  rivet(size - 9, size - 9);
  rivet(size - 45, size - 9);
  rivet(size - 9, size - 45);

  // Black CS stencil text
  ctx.save();
  ctx.fillStyle = 'rgba(20, 15, 10, 0.85)';
  ctx.font = 'bold 44px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CS 1.6', size / 2, size / 2 - 15);
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('FRAGILE', size / 2, size / 2 + 25);
  ctx.font = '18px monospace';
  ctx.fillText('MANSION / 45LBS', size / 2, size / 2 + 55);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Swimming pool blue mosaic tiles
 */
export function createPoolTilesTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // White grout lines
  ctx.fillStyle = '#d0e5f5';
  ctx.fillRect(0, 0, size, size);

  const tiles = 16;
  const tileSize = size / tiles;
  for (let y = 0; y < tiles; y++) {
    for (let x = 0; x < tiles; x++) {
      // Aqua blue variation
      const r = 20 + Math.random() * 25;
      const g = 140 + Math.random() * 40;
      const b = 210 + Math.random() * 35;
      ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
      ctx.fillRect(x * tileSize + 1.5, y * tileSize + 1.5, tileSize - 3, tileSize - 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Semi-transparent pool water ripple texture
 */
export function createWaterTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep crystal aqua gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, 'rgba(0, 160, 220, 0.7)');
  grad.addColorStop(0.5, 'rgba(30, 200, 240, 0.75)');
  grad.addColorStop(1, 'rgba(0, 140, 200, 0.7)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Caustic highlight curves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const sx = Math.random() * size;
    const sy = Math.random() * size;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + (Math.random() - 0.5) * 120,
      sy + (Math.random() - 0.5) * 120,
      sx + (Math.random() - 0.5) * 120,
      sy + (Math.random() - 0.5) * 120,
      sx + (Math.random() - 0.5) * 100,
      sy + (Math.random() - 0.5) * 100
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Courtyard grass texture
 */
export function createGrassTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base green
  ctx.fillStyle = '#486828';
  ctx.fillRect(0, 0, size, size);

  // Grass blade flecks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const g = 90 + Math.random() * 60;
    const r = 50 + Math.random() * 40;
    ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, 25)`;
    ctx.fillRect(x, y, 2, 4 + Math.random() * 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Concrete sidewalk / basement bunker texture
 */
export function createConcreteTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#7a7a78';
  ctx.fillRect(0, 0, size, size);

  // Concrete speckles
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const shade = 90 + Math.random() * 70;
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Parquet wood floor for interior mansion rooms
 */
export function createWoodFloorTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9e6b3e';
  ctx.fillRect(0, 0, size, size);

  const planks = 8;
  const pw = size / planks;
  for (let i = 0; i < planks; i++) {
    const shade = (i % 2 === 0 ? 1 : 0.88) + (Math.random() * 0.1 - 0.05);
    ctx.fillStyle = `rgb(${Math.floor(165 * shade)}, ${Math.floor(115 * shade)}, ${Math.floor(65 * shade)})`;
    ctx.fillRect(i * pw, 0, pw - 2, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Security Camera CCTV monitor (Second floor surveillance room)
 */
export function createCctvTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 384;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Black monitor bezel
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, width, height);

  // 4 camera quadrants
  const qW = (width - 12) / 2;
  const qH = (height - 12) / 2;
  const cams = [
    { title: 'CAM 01: FRONT YARD / CT SPAWN', col: '#1a2e22', x: 4, y: 4 },
    { title: 'CAM 02: SWIMMING POOL', col: '#102a3a', x: qW + 8, y: 4 },
    { title: 'CAM 03: 2ND FLOOR BALCONY', col: '#2a2215', x: 4, y: qH + 8 },
    { title: 'CAM 04: BASEMENT TUNNEL', col: '#1e1c20', x: qW + 8, y: qH + 8 },
  ];

  for (const c of cams) {
    ctx.fillStyle = c.col;
    ctx.fillRect(c.x, c.y, qW, qH);

    // Green scanlines
    ctx.fillStyle = 'rgba(0, 255, 120, 0.05)';
    for (let sl = c.y; sl < c.y + qH; sl += 4) {
      ctx.fillRect(c.x, sl, qW, 1.5);
    }

    // Camera title text
    ctx.fillStyle = '#00ff66';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(c.title, c.x + 8, c.y + 18);

    // REC symbol
    ctx.fillStyle = '#ff2222';
    ctx.beginPath();
    ctx.arc(c.x + qW - 14, c.y + 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText('REC', c.x + qW - 40, c.y + 17);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
