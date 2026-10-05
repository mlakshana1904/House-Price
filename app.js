/**
 * AETHER-GRAV // Antigravity Research, Simulation & Flight Analytics Engine
 * Principal Developer & Designer Implementation
 */

// Application State
const state = {
  // Input Parameters
  frequency: 14.20, // GHz
  flux: 15.5, // Tesla
  temp: 4.2, // Kelvin
  mass: 1250, // kg
  area: 12.5, // m²
  vectorAngle: 0, // Degrees
  rpm: 4500, // Discs rotation speed RPM
  theoryModel: 'podkletnov', // 'electrogravitics' | 'podkletnov' | 'alcubierre' | 'quantum'

  // Calculated Metrics
  geff: 0.12, // g
  weightReduction: 87.8, // %
  powerMW: 8.45, // MW
  stabilityIndex: 98.4, // %
  liftForce: 10.77, // kN
  thrustForce: 0.0, // kN
  resonancePeak: false,

  // Runtime Controls
  isRunning: true,
  audioMuted: false,
  theme: 'dark',
  activeTab: 'simulator',
  
  // History buffer for charts & log export
  telemetryHistory: [],
  maxHistoryLength: 40,
  tickCount: 0
};

// Web Audio API Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.osc = null;
    this.gain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.osc = this.ctx.createOscillator();
      this.gain = this.ctx.createGain();

      this.osc.type = 'sine';
      this.osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      this.gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.osc.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.osc.start();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not allowed or supported', e);
    }
  }

  updatePitch(freqGhz, running) {
    if (!this.initialized || state.audioMuted || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!running) {
      this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      return;
    }
    const audioFreq = 80 + (freqGhz * 6.5);
    this.osc.frequency.setTargetAtTime(audioFreq, this.ctx.currentTime, 0.1);
    this.gain.gain.setTargetAtTime(state.audioMuted ? 0 : 0.025, this.ctx.currentTime, 0.1);
  }

  playClick() {
    if (!this.initialized || state.audioMuted) return;
    try {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(800, this.ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);
      clickGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start();
      clickOsc.stop(this.ctx.currentTime + 0.06);
    } catch(e){}
  }

  playWarpPulse() {
    if (!this.initialized || state.audioMuted) return;
    try {
      const pulseOsc = this.ctx.createOscillator();
      const pulseGain = this.ctx.createGain();
      pulseOsc.type = 'sawtooth';
      pulseOsc.frequency.setValueAtTime(200, this.ctx.currentTime);
      pulseOsc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
      pulseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      pulseGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(this.ctx.destination);
      pulseOsc.start();
      pulseOsc.stop(this.ctx.currentTime + 0.35);
    } catch(e){}
  }
}

const audio = new SoundEngine();

// Physics Engine Calculations
function updatePhysics() {
  const f = parseFloat(state.frequency);
  const B = parseFloat(state.flux);
  const T = parseFloat(state.temp);
  const m = parseFloat(state.mass);
  const A = parseFloat(state.area);
  const theta = parseFloat(state.vectorAngle);
  const rpm = parseFloat(state.rpm);

  // Superconductivity Factor (K_super)
  // Low temp (< 10K) gives maximum superconductive flux pin strength
  const K_super = 1 / (1 + Math.exp((T - 35) / 10));

  // Multi-frequency Resonance Peaks
  const peak1 = 0.50 * Math.exp(-Math.pow(f - 14.2, 2) / 3.0);
  const peak2 = 0.75 * Math.exp(-Math.pow(f - 45.0, 2) / 6.0);
  const peak3 = 0.95 * Math.exp(-Math.pow(f - 88.5, 2) / 8.0);
  const R_freq = 1.0 + peak1 + peak2 + peak3;

  state.resonancePeak = (peak1 > 0.3 || peak2 > 0.45 || peak3 > 0.6);

  // Model Multiplier
  let modelMult = 1.0;
  if (state.theoryModel === 'electrogravitics') modelMult = 0.85;
  if (state.theoryModel === 'podkletnov') modelMult = 1.15;
  if (state.theoryModel === 'alcubierre') modelMult = 1.45;
  if (state.theoryModel === 'quantum') modelMult = 1.30;

  // Weight Reduction Ratio calculation (%)
  const fluxFactor = Math.pow(B / 35.0, 1.35);
  const rpmFactor = 1.0 + (rpm / 6000.0);
  
  let rawReduction = fluxFactor * rpmFactor * R_freq * K_super * modelMult * 52.0;
  
  // Dynamic slight jitter to represent quantum fluctuation noise
  const noise = (Math.random() - 0.5) * 0.4;
  state.weightReduction = Math.max(0, Math.min(220, rawReduction + noise));

  // Effective Gravity geff = 1.0g * (1 - reduction/100)
  state.geff = 1.0 - (state.weightReduction / 100.0);

  // Lift & Thrust Forces (kN)
  const gBase = 9.81; // m/s²
  const totalLiftVector = m * gBase * (state.weightReduction / 100.0) / 1000.0; // kN
  const radAngle = (theta * Math.PI) / 180.0;
  
  state.liftForce = totalLiftVector * Math.cos(radAngle);
  state.thrustForce = totalLiftVector * Math.sin(radAngle);

  // Power MW calculation
  const basePower = 0.8 + (Math.pow(B, 1.9) * 0.02) + (Math.pow(f, 1.4) * 0.008) + (rpm * 0.0003);
  const tempEfficiency = 1.0 + Math.max(0, (T - 20) * 0.005);
  state.powerMW = Math.max(0.1, basePower * tempEfficiency);

  // Stability Index Score (0 - 100%)
  let stability = 99.4 - (T / 300.0) * 20.0 - (B > 40 ? (B - 40) * 2.5 : 0);
  if (state.resonancePeak) stability += 2.0;
  state.stabilityIndex = Math.max(10, Math.min(100, stability + noise));

  // Update DOM telemetry
  renderTelemetryMetrics();
}

function renderTelemetryMetrics() {
  const geffEl = document.getElementById('metric-geff');
  const geffSub = document.getElementById('metric-geff-sub');
  const wrEl = document.getElementById('metric-wr');
  const wrSub = document.getElementById('metric-wr-sub');
  const powerEl = document.getElementById('metric-power');
  const stabilityEl = document.getElementById('metric-stability');
  
  const liftEl = document.getElementById('metric-lift');
  const thrustEl = document.getElementById('metric-thrust');
  const resonanceBadge = document.getElementById('badge-resonance');

  if (geffEl) {
    geffEl.innerText = `${state.geff >= 0 ? '+' : ''}${state.geff.toFixed(2)} g`;
    geffEl.className = `text-3xl font-bold font-orbitron ${state.geff < 0 ? 'text-cyan-glow' : state.geff < 0.2 ? 'text-emerald-glow' : 'text-slate-100'}`;
  }
  if (geffSub) {
    const ms2 = (state.geff * 9.81).toFixed(2);
    geffSub.innerText = `(${ms2} m/s²) ${state.geff < 0 ? '• UPWARD ANTI-MASS' : '• PARTIAL SHIELDING'}`;
  }

  if (wrEl) {
    wrEl.innerText = `${state.weightReduction.toFixed(1)}%`;
  }
  if (wrSub) {
    wrSub.innerText = state.weightReduction >= 100 ? 'NET LEVITATION THRESHOLD PASSED' : 'GRAVITATIONAL OFFSET IN PROGRESS';
  }

  if (powerEl) {
    powerEl.innerText = `${state.powerMW.toFixed(2)} MW`;
  }
  if (stabilityEl) {
    stabilityEl.innerText = `${state.stabilityIndex.toFixed(1)}%`;
  }

  if (liftEl) liftEl.innerText = `${state.liftForce.toFixed(2)} kN`;
  if (thrustEl) thrustEl.innerText = `${state.thrustForce.toFixed(2)} kN`;

  if (resonanceBadge) {
    if (state.resonancePeak) {
      resonanceBadge.classList.remove('hidden');
    } else {
      resonanceBadge.classList.add('hidden');
    }
  }

  // Live top header telemetry badges
  const hdrFieldCoherence = document.getElementById('hdr-coherence');
  const hdrGravOffset = document.getElementById('hdr-offset');
  const hdrPowerGrid = document.getElementById('hdr-power');

  if (hdrFieldCoherence) hdrFieldCoherence.innerText = `${state.stabilityIndex.toFixed(1)}%`;
  if (hdrGravOffset) hdrGravOffset.innerText = `${state.geff >= 0 ? '+' : ''}${state.geff.toFixed(2)}g`;
  if (hdrPowerGrid) hdrPowerGrid.innerText = `${state.powerMW.toFixed(1)} MW`;
}

// Chart.js Visualization Initializations
let waveChart, energyChart;

function initCharts() {
  const ctxWave = document.getElementById('chart-wave')?.getContext('2d');
  const ctxEnergy = document.getElementById('chart-energy')?.getContext('2d');

  if (ctxWave) {
    const initialLabels = Array.from({length: 25}, (_, i) => `T-${25-i}s`);
    const initialData1 = Array.from({length: 25}, () => 0.12 + Math.random()*0.02);
    const initialData2 = Array.from({length: 25}, () => 87.5 + Math.random()*1.5);

    waveChart = new Chart(ctxWave, {
      type: 'line',
      data: {
        labels: initialLabels,
        datasets: [
          {
            label: 'Effective Gravity (g)',
            data: initialData1,
            borderColor: '#00F0FF',
            backgroundColor: 'rgba(0, 240, 255, 0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            yAxisID: 'y'
          },
          {
            label: 'Weight Reduction %',
            data: initialData2,
            borderColor: '#A855F7',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.35,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748B', font: { family: 'Fira Code', size: 10 } }
          },
          y: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#00F0FF', font: { family: 'Fira Code', size: 10 } },
            title: { display: true, text: 'Gravity (g)', color: '#00F0FF' }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#A855F7', font: { family: 'Fira Code', size: 10 } },
            title: { display: true, text: 'Reduction (%)', color: '#A855F7' }
          }
        },
        plugins: {
          legend: { labels: { color: '#F8FAFC', font: { family: 'Inter', size: 12 } } }
        }
      }
    });
  }

  if (ctxEnergy) {
    const energyData = [];
    for (let f = 1; f <= 50; f += 2) {
      const lift = Math.pow(f / 20, 1.5) * 12;
      const mw = 0.5 + Math.pow(f / 15, 1.8) * 4;
      energyData.push({ x: mw, y: lift, frequency: f });
    }

    energyChart = new Chart(ctxEnergy, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Lift Force vs Power Consumption',
          data: energyData,
          backgroundColor: '#10B981',
          borderColor: '#00F0FF',
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Input Power (MW)', color: '#F8FAFC' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          },
          y: {
            title: { display: true, text: 'Anti-Mass Lift (kN)', color: '#F8FAFC' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          }
        },
        plugins: {
          legend: { labels: { color: '#F8FAFC' } },
          tooltip: {
            callbacks: {
              label: (context) => `Power: ${context.parsed.x.toFixed(2)} MW, Lift: ${context.parsed.y.toFixed(2)} kN`
            }
          }
        }
      }
    });
  }
}

function updateCharts() {
  if (!waveChart) return;

  state.tickCount++;
  const label = `T+${state.tickCount}s`;

  waveChart.data.labels.push(label);
  waveChart.data.datasets[0].data.push(state.geff);
  waveChart.data.datasets[1].data.push(state.weightReduction);

  if (waveChart.data.labels.length > 30) {
    waveChart.data.labels.shift();
    waveChart.data.datasets[0].data.shift();
    waveChart.data.datasets[1].data.shift();
  }

  waveChart.update();

  // Buffer telemetry for CSV Export
  state.telemetryHistory.push({
    timestamp: new Date().toISOString(),
    frequency: state.frequency,
    flux: state.flux,
    temp: state.temp,
    mass: state.mass,
    geff: state.geff.toFixed(3),
    weightReduction: state.weightReduction.toFixed(2),
    liftForce: state.liftForce.toFixed(2),
    powerMW: state.powerMW.toFixed(2),
    stability: state.stabilityIndex.toFixed(1)
  });

  if (state.telemetryHistory.length > 200) {
    state.telemetryHistory.shift();
  }
}

// Interactive 2D Spacetime Distortion Canvas Visualizer
let canvas, ctxCanvas, animFrameId;
let particles = [];

function initCanvasVisualizer() {
  canvas = document.getElementById('field-canvas');
  if (!canvas) return;
  ctxCanvas = canvas.getContext('2d');

  function resizeCanvas() {
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight || 320;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Initialize Quantum Field Particles
  particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.5
    });
  }

  renderCanvas();
}

function renderCanvas() {
  if (!ctxCanvas || !canvas) return;

  ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + 10;
  const t = Date.now() * 0.002;

  // Draw 2D Distorted Mesh Grid
  const rows = 12;
  const cols = 20;
  const gridW = canvas.width * 0.85;
  const gridH = canvas.height * 0.6;
  const startX = (canvas.width - gridW) / 2;
  const startY = (canvas.height - gridH) / 2 + 40;

  // Warp factor based on geff (negative geff pulls grid UP, positive pulls DOWN)
  const warpOffset = (1.0 - state.geff) * 35;

  ctxCanvas.strokeStyle = 'rgba(0, 240, 255, 0.12)';
  ctxCanvas.lineWidth = 1;

  for (let r = 0; r <= rows; r++) {
    ctxCanvas.beginPath();
    for (let c = 0; c <= cols; c++) {
      const px = startX + (c / cols) * gridW;
      let py = startY + (r / rows) * gridH;

      // Distance from center for radial distortion wave
      const dist = Math.hypot(px - cx, py - cy);
      const warp = Math.exp(-dist / 140) * Math.sin(dist * 0.05 - t * 2) * warpOffset;

      if (c === 0) ctxCanvas.moveTo(px, py - warp);
      else ctxCanvas.lineTo(px, py - warp);
    }
    ctxCanvas.stroke();
  }

  for (let c = 0; c <= cols; c++) {
    ctxCanvas.beginPath();
    for (let r = 0; r <= rows; r++) {
      const px = startX + (c / cols) * gridW;
      let py = startY + (r / rows) * gridH;
      const dist = Math.hypot(px - cx, py - cy);
      const warp = Math.exp(-dist / 140) * Math.sin(dist * 0.05 - t * 2) * warpOffset;

      if (r === 0) ctxCanvas.moveTo(px, py - warp);
      else ctxCanvas.lineTo(px, py - warp);
    }
    ctxCanvas.stroke();
  }

  // Superconducting Rotating Core Rings (Glow Effect)
  const ringRadius = 75;
  const rotSpeed = (state.rpm / 6000) * t;

  // Outer Pulsing Aura
  const grad = ctxCanvas.createRadialGradient(cx, cy - (warpOffset * 0.4), 10, cx, cy - (warpOffset * 0.4), ringRadius * 1.8);
  const coreHue = state.geff < 0 ? 'rgba(0, 240, 255,' : 'rgba(138, 43, 226,';
  grad.addColorStop(0, `${coreHue} 0.45)`);
  grad.addColorStop(0.6, `${coreHue} 0.15)`);
  grad.addColorStop(1, 'transparent');

  ctxCanvas.fillStyle = grad;
  ctxCanvas.beginPath();
  ctxCanvas.arc(cx, cy - (warpOffset * 0.4), ringRadius * 1.8, 0, Math.PI * 2);
  ctxCanvas.fill();

  // Rotating Primary Disc Rings
  ctxCanvas.save();
  ctxCanvas.translate(cx, cy - (warpOffset * 0.4));
  ctxCanvas.scale(1, 0.45); // Isometric skew
  ctxCanvas.rotate(rotSpeed);

  ctxCanvas.strokeStyle = '#00F0FF';
  ctxCanvas.lineWidth = 3;
  ctxCanvas.shadowColor = '#00F0FF';
  ctxCanvas.shadowBlur = 15;
  ctxCanvas.beginPath();
  ctxCanvas.arc(0, 0, ringRadius, 0, Math.PI * 2);
  ctxCanvas.stroke();

  // Secondary Magnetic Disc Segment
  ctxCanvas.strokeStyle = '#A855F7';
  ctxCanvas.lineWidth = 2;
  ctxCanvas.beginPath();
  ctxCanvas.arc(0, 0, ringRadius * 0.75, Math.PI * 0.5, Math.PI * 1.8);
  ctxCanvas.stroke();

  ctxCanvas.restore();

  // Floating Craft / Payload Marker
  const craftY = cy - 45 - (warpOffset * 0.6);
  ctxCanvas.fillStyle = '#F8FAFC';
  ctxCanvas.shadowColor = '#00F0FF';
  ctxCanvas.shadowBlur = 20;

  ctxCanvas.beginPath();
  ctxCanvas.moveTo(cx, craftY - 16);
  ctxCanvas.lineTo(cx + 18, craftY + 12);
  ctxCanvas.lineTo(cx - 18, craftY + 12);
  ctxCanvas.closePath();
  ctxCanvas.fill();

  // Vector Force Arrow
  const arrowLen = Math.min(60, Math.abs(state.liftForce) * 3);
  const arrowColor = state.geff < 0 ? '#00F0FF' : '#10B981';

  ctxCanvas.strokeStyle = arrowColor;
  ctxCanvas.lineWidth = 3;
  ctxCanvas.shadowColor = arrowColor;
  ctxCanvas.shadowBlur = 10;

  ctxCanvas.beginPath();
  ctxCanvas.moveTo(cx, craftY);
  ctxCanvas.lineTo(cx, craftY - arrowLen);
  ctxCanvas.stroke();

  // Arrowhead
  ctxCanvas.fillStyle = arrowColor;
  ctxCanvas.beginPath();
  ctxCanvas.moveTo(cx - 5, craftY - arrowLen + 5);
  ctxCanvas.lineTo(cx, craftY - arrowLen - 3);
  ctxCanvas.lineTo(cx + 5, craftY - arrowLen + 5);
  ctxCanvas.fill();

  // Text label on vector
  ctxCanvas.fillStyle = '#F8FAFC';
  ctxCanvas.font = '10px Fira Code';
  ctxCanvas.fillText(`F_lift = ${state.liftForce.toFixed(1)} kN`, cx + 22, craftY - (arrowLen / 2));

  // Quantum Particle Flow
  particles.forEach(p => {
    p.angle += p.speed * 0.02 * (state.frequency / 20);
    p.x = cx + Math.cos(p.angle) * (ringRadius + Math.sin(t + p.radius) * 30);
    p.y = (cy - (warpOffset * 0.4)) + Math.sin(p.angle) * (ringRadius * 0.45 + Math.cos(t) * 10);

    ctxCanvas.fillStyle = state.geff < 0 ? '#00F0FF' : '#10B981';
    ctxCanvas.beginPath();
    ctxCanvas.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctxCanvas.fill();
  });

  animFrameId = requestAnimationFrame(renderCanvas);
}

// Spacetime Distortion Heatmap Canvas Generator
function drawHeatmapCanvas() {
  const heatCanvas = document.getElementById('canvas-heatmap');
  if (!heatCanvas) return;
  const hCtx = heatCanvas.getContext('2d');
  
  heatCanvas.width = heatCanvas.parentElement.clientWidth || 320;
  heatCanvas.height = 180;

  const w = heatCanvas.width;
  const h = heatCanvas.height;
  const imgData = hCtx.createImageData(w, h);
  const data = imgData.data;

  const cx = w / 2;
  const cy = h / 2;

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const index = (y * w + x) * 4;
      const dx = (x - cx) / 12;
      const dy = (y - cy) / 12;
      const r = Math.sqrt(dx * dx + dy * dy);

      // Metric distortion formula map
      const val = Math.exp(-r * 0.2) * (state.flux / 50) * Math.sin(r * 0.8 - (state.frequency * 0.1));

      // Color mapping: Cyan -> Violet -> Deep Navy
      let red = Math.floor(Math.abs(val) * 200 + 10);
      let green = Math.floor((1 - Math.min(1, r / 15)) * 240);
      let blue = Math.floor(220 + val * 35);

      data[index] = Math.min(255, red);
      data[index + 1] = Math.min(255, green);
      data[index + 2] = Math.min(255, blue);
      data[index + 3] = 230; // Alpha
    }
  }

  hCtx.putImageData(imgData, 0, 0);

  // Overlay Contour rings
  hCtx.strokeStyle = 'rgba(255,255,255,0.2)';
  hCtx.lineWidth = 1;
  for (let cr = 20; cr < w / 2; cr += 35) {
    hCtx.beginPath();
    hCtx.arc(cx, cy, cr, 0, Math.PI * 2);
    hCtx.stroke();
  }

  hCtx.fillStyle = '#F8FAFC';
  hCtx.font = '10px Orbitron';
  hCtx.fillText('CORE METRIC ORIGIN (r=0)', cx - 65, cy + 4);
}

// Toast Notifications Manager
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast flex items-center justify-between gap-3';
  
  let borderColor = 'var(--quantum-cyan)';
  let icon = '⚡';
  if (type === 'warning') { borderColor = 'var(--supernova-amber)'; icon = '⚠️'; }
  if (type === 'danger') { borderColor = 'var(--pulse-red)'; icon = '🚨'; }
  if (type === 'success') { borderColor = 'var(--neon-emerald)'; icon = '✅'; }

  toast.style.borderLeftColor = borderColor;

  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-base">${icon}</span>
      <span class="text-xs font-medium text-slate-200">${message}</span>
    </div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white text-sm font-bold">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// Presets Loader
const presets = {
  podkletnov: {
    frequency: 14.20,
    flux: 15.5,
    temp: 4.2,
    mass: 1250,
    area: 12.5,
    vectorAngle: 0,
    rpm: 5500,
    theoryModel: 'podkletnov'
  },
  alcubierre: {
    frequency: 88.50,
    flux: 42.0,
    temp: 1.8,
    mass: 5000,
    area: 45.0,
    vectorAngle: 15,
    rpm: 9800,
    theoryModel: 'alcubierre'
  },
  biefeld: {
    frequency: 0.45,
    flux: 12.0,
    temp: 293.0,
    mass: 150,
    area: 4.5,
    vectorAngle: -5,
    rpm: 0,
    theoryModel: 'electrogravitics'
  },
  quantum: {
    frequency: 45.00,
    flux: 28.5,
    temp: 0.5,
    mass: 800,
    area: 8.0,
    vectorAngle: 0,
    rpm: 3200,
    theoryModel: 'quantum'
  }
};

function applyPreset(presetKey) {
  const p = presets[presetKey];
  if (!p) return;

  state.frequency = p.frequency;
  state.flux = p.flux;
  state.temp = p.temp;
  state.mass = p.mass;
  state.area = p.area;
  state.vectorAngle = p.vectorAngle;
  state.rpm = p.rpm;
  state.theoryModel = p.theoryModel;

  // Update DOM sliders & inputs
  document.getElementById('input-freq').value = p.frequency;
  document.getElementById('val-freq').innerText = `${p.frequency.toFixed(2)} GHz`;

  document.getElementById('input-flux').value = p.flux;
  document.getElementById('val-flux').innerText = `${p.flux.toFixed(1)} Tesla`;

  document.getElementById('input-temp').value = p.temp;
  document.getElementById('val-temp').innerText = `${p.temp.toFixed(1)} K`;

  document.getElementById('input-mass').value = p.mass;
  document.getElementById('val-mass').innerText = `${p.mass} kg`;

  document.getElementById('input-area').value = p.area;
  document.getElementById('val-area').innerText = `${p.area.toFixed(1)} m²`;

  document.getElementById('input-angle').value = p.vectorAngle;
  document.getElementById('val-angle').innerText = `${p.vectorAngle}°`;

  document.getElementById('input-rpm').value = p.rpm;
  document.getElementById('val-rpm').innerText = `${p.rpm} RPM`;

  const modelSelect = document.getElementById('select-theory');
  if (modelSelect) modelSelect.value = p.theoryModel;

  audio.playWarpPulse();
  showToast(`Preset loaded: ${presetKey.toUpperCase()} CONFIGURATION`, 'success');
  updatePhysics();
  drawHeatmapCanvas();
}

// CSV Telemetry Export Function
function exportCSVLogs() {
  if (state.telemetryHistory.length === 0) {
    showToast('No telemetry logs captured yet. Run simulation first!', 'warning');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Timestamp,Frequency(GHz),Flux(Tesla),Temp(K),Mass(kg),EffectiveGravity(g),WeightReduction(%),LiftForce(kN),Power(MW),Stability(%)\n';

  state.telemetryHistory.forEach(row => {
    csvContent += `${row.timestamp},${row.frequency},${row.flux},${row.temp},${row.mass},${row.geff},${row.weightReduction},${row.liftForce},${row.powerMW},${row.stability}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `aether_grav_flight_telemetry_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Flight & Gravity Telemetry CSV Exported!', 'success');
}

// PDF Printable Telemetry Report Generator Modal
function openPDFReportModal() {
  const modal = document.getElementById('report-modal');
  if (!modal) return;

  const snapshotDate = new Date().toLocaleString();
  document.getElementById('rpt-date').innerText = snapshotDate;
  document.getElementById('rpt-freq').innerText = `${state.frequency.toFixed(2)} GHz`;
  document.getElementById('rpt-flux').innerText = `${state.flux.toFixed(1)} T`;
  document.getElementById('rpt-temp').innerText = `${state.temp.toFixed(1)} K`;
  document.getElementById('rpt-geff').innerText = `${state.geff.toFixed(3)} g`;
  document.getElementById('rpt-wr').innerText = `${state.weightReduction.toFixed(1)} %`;
  document.getElementById('rpt-lift').innerText = `${state.liftForce.toFixed(2)} kN`;
  document.getElementById('rpt-power').innerText = `${state.powerMW.toFixed(2)} MW`;
  document.getElementById('rpt-stability').innerText = `${state.stabilityIndex.toFixed(1)} %`;

  modal.classList.remove('hidden');
}

function closePDFReportModal() {
  const modal = document.getElementById('report-modal');
  if (modal) modal.classList.add('hidden');
}

function printReport() {
  window.print();
}

// Event Listeners Initialization
function setupEventListeners() {
  // Input Sliders & Steppers
  const bindSlider = (id, valId, unit, stateKey, isFloat = true) => {
    const slider = document.getElementById(id);
    const valEl = document.getElementById(valId);
    if (slider && valEl) {
      slider.addEventListener('input', (e) => {
        const val = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value);
        state[stateKey] = val;
        valEl.innerText = `${val.toFixed ? (isFloat ? val.toFixed(1) : val) : val} ${unit}`;
        audio.playClick();
        audio.updatePitch(state.frequency, state.isRunning);
        updatePhysics();
        drawHeatmapCanvas();
      });
    }
  };

  bindSlider('input-freq', 'val-freq', 'GHz', 'frequency', true);
  bindSlider('input-flux', 'val-flux', 'Tesla', 'flux', true);
  bindSlider('input-temp', 'val-temp', 'K', 'temp', true);
  bindSlider('input-mass', 'val-mass', 'kg', 'mass', false);
  bindSlider('input-area', 'val-area', 'm²', 'area', true);
  bindSlider('input-angle', 'val-angle', '°', 'vectorAngle', false);
  bindSlider('input-rpm', 'val-rpm', 'RPM', 'rpm', false);

  // Quick Preset Frequency Buttons
  document.querySelectorAll('.btn-quick-freq').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const f = parseFloat(e.target.dataset.freq);
      state.frequency = f;
      document.getElementById('input-freq').value = f;
      document.getElementById('val-freq').innerText = `${f.toFixed(2)} GHz`;
      audio.playWarpPulse();
      showToast(`Frequency aligned to resonance: ${f} GHz`, 'info');
      updatePhysics();
      drawHeatmapCanvas();
    });
  });

  // Theory Model Dropdown
  const selectTheory = document.getElementById('select-theory');
  if (selectTheory) {
    selectTheory.addEventListener('change', (e) => {
      state.theoryModel = e.target.value;
      audio.playClick();
      showToast(`Theoretical Model switched to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
      updatePhysics();
    });
  }

  // Presets Selector
  const selectPreset = document.getElementById('select-preset');
  if (selectPreset) {
    selectPreset.addEventListener('change', (e) => {
      if (e.target.value) {
        applyPreset(e.target.value);
      }
    });
  }

  // Simulation Play / Pause Button
  const btnRun = document.getElementById('btn-toggle-sim');
  if (btnRun) {
    btnRun.addEventListener('click', () => {
      state.isRunning = !state.isRunning;
      audio.init();
      audio.playClick();
      
      btnRun.innerHTML = state.isRunning ? 
        `<span class="pulse-dot"></span><span>SIMULATION ACTIVE</span>` : 
        `<span class="pulse-dot pulse-dot-red"></span><span>SIMULATION PAUSED</span>`;
      
      showToast(state.isRunning ? 'Telemetry simulation engine RUNNING' : 'Simulation PAUSED', state.isRunning ? 'success' : 'warning');
    });
  }

  // Audio Toggle
  const btnAudio = document.getElementById('btn-toggle-audio');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      audio.init();
      state.audioMuted = !state.audioMuted;
      btnAudio.innerText = state.audioMuted ? '🔇 Audio: OFF' : '🔊 Audio: ON';
      showToast(state.audioMuted ? 'Acoustic telemetry feedback MUTED' : 'Acoustic synthesizer ENABLED', 'info');
    });
  }

  // Theme Toggle
  const btnTheme = document.getElementById('btn-toggle-theme');
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      state.theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      btnTheme.innerText = state.theme === 'light' ? '☀️ Light Lab' : '🌙 Cyber Dark';
    });
  }

  // Navigation Tab Switcher
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const tabId = tab.dataset.tab;
      state.activeTab = tabId;

      document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
      const targetSec = document.getElementById(`tab-sec-${tabId}`);
      if (targetSec) targetSec.classList.remove('hidden');

      audio.playClick();
    });
  });

  // Export Buttons
  const btnExportCSV = document.getElementById('btn-export-csv');
  if (btnExportCSV) btnExportCSV.addEventListener('click', exportCSVLogs);

  const btnExportPDF = document.getElementById('btn-export-pdf');
  if (btnExportPDF) btnExportPDF.addEventListener('click', openPDFReportModal);

  // Initialize Web Audio on first user interaction
  document.body.addEventListener('click', () => audio.init(), { once: true });
}

// Main Simulation Loop (1 second timer updates)
function startMainLoop() {
  setInterval(() => {
    if (state.isRunning) {
      updatePhysics();
      updateCharts();
      drawHeatmapCanvas();
      audio.updatePitch(state.frequency, true);
    }
  }, 1000);
}

// DOM Initialization Entry Point
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updatePhysics();
  initCharts();
  initCanvasVisualizer();
  drawHeatmapCanvas();
  startMainLoop();

  // Initial welcome toast
  setTimeout(() => {
    showToast('AETHER-GRAV Dynamics Platform v4.8 Initialized. Quantum Field Coherence Nominal.', 'success');
  }, 600);
});
