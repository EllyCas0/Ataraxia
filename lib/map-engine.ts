import type { LinkKind, School } from "./philosophy-map";

// Canvas 2D engine for the Schools of Thought map. It owns drawing, the floating
// motion, the camera glide, hit-testing, and the neon edge effects. React only
// creates it, tells it which school is active, and receives picks back.

export interface Point {
  x: number;
  y: number;
}

export function quadPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

// Control point offset perpendicular to the line, proportional to its length.
export function controlPoint(a: Point, b: Point, bend: number): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { x: (a.x + b.x) / 2 - dy * bend, y: (a.y + b.y) / 2 + dx * bend };
}

export interface MapEngine {
  setActive(id: string | null): void;
  setSelectedOffset(fractionOfHeight: number): void;
  setReducedMotion(reduced: boolean): void;
  destroy(): void;
}

const NODE_RADIUS = 30;
const FLOAT_AMPLITUDE = 9;
const CAMERA_RATE = 4.2; // per second; roughly 0.7s to settle
const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Charter, Georgia, serif';
const SANS = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const NEON: Record<LinkKind, [number, number, number]> = {
  affinity: [46, 230, 255],
  tension: [255, 70, 200],
};

interface NodeState {
  school: School;
  bx: number;
  by: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  r: number;
  scale: number;
  glow: number;
  dim: number;
  hover: number;
}

interface EdgeState {
  a: NodeState;
  b: NodeState;
  kind: LinkKind;
  label: string;
  glow: number;
  bend: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function createMapEngine(
  canvas: HTMLCanvasElement,
  schools: School[],
  onPick: (id: string | null) => void,
): MapEngine {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setActive() {}, setSelectedOffset() {}, setReducedMotion() {}, destroy() {} };

  const nodes: NodeState[] = schools.map((school, i) => ({
    school,
    bx: 0,
    by: 0,
    fx: 0.35 + (i % 3) * 0.11,
    fy: 0.3 + ((i + 1) % 3) * 0.09,
    px: i * 1.7,
    py: i * 2.3 + 0.8,
    x: 0,
    y: 0,
    sx: 0,
    sy: 0,
    r: NODE_RADIUS,
    scale: 1,
    glow: 0,
    dim: 1,
    hover: 0,
  }));
  const byId = new Map(nodes.map((n) => [n.school.id, n]));

  // Each connection appears on both schools; keep one edge per pair.
  const edges: EdgeState[] = [];
  for (const node of nodes) {
    for (const connection of node.school.connections) {
      const other = byId.get(connection.id);
      if (!other || node.school.id > other.school.id) continue;
      edges.push({ a: node, b: other, kind: connection.kind, label: connection.label, glow: 0, bend: edges.length % 2 ? 0.13 : -0.13 });
    }
  }

  let seed = 11;
  const random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const stars = Array.from({ length: 80 }, () => ({ x: random(), y: random(), depth: 0.2 + random() * 0.8, size: 0.4 + random() * 1.1, phase: random() * 6.28 }));

  const camera = { x: 0, y: 0, zoom: 1, oy: 0 };
  let activeId: string | null = null;
  let selectedOffset = 0;
  let reduced = false;
  let hoverId: string | null = null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let baseScale = 1;
  let time = 0;
  let last = performance.now();
  let frameId = 0;
  let destroyed = false;

  // On tall (phone-shaped) screens the layout is turned a quarter turn so it fills the height,
  // and the map is scaled to fit the actual spread of the nodes plus room for their labels.
  function layout() {
    const rotated = height > width * 1.15;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      const { x, y } = n.school.position;
      n.bx = rotated ? -y : x;
      n.by = rotated ? x : y;
      minX = Math.min(minX, n.bx);
      maxX = Math.max(maxX, n.bx);
      minY = Math.min(minY, n.by);
      maxY = Math.max(maxY, n.by);
    }
    // Center the layout on its own bounds so nothing leans toward one edge.
    const shiftX = (minX + maxX) / 2;
    const shiftY = (minY + maxY) / 2;
    for (const n of nodes) {
      n.bx -= shiftX;
      n.by -= shiftY;
    }
    if (width > 0 && height > 0) {
      // Horizontal padding reserves room for the widest label on either side of the outer nodes.
      baseScale = clamp(Math.min(width / (maxX - minX + 250), height / (maxY - minY + 170)), 0.5, 1.6);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    layout();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  // Zoom in on the selected school, but only as far as keeps its connections on screen.
  function zoomTargetFor(active: NodeState): number {
    const centerY = height / 2 + selectedOffset * height;
    const halfWidth = width / 2 - 80;
    const halfHeight = Math.max(40, Math.min(centerY, height - centerY) - 60);
    let maxDx = 1;
    let maxDy = 1;
    for (const connection of active.school.connections) {
      const other = byId.get(connection.id);
      if (!other) continue;
      maxDx = Math.max(maxDx, Math.abs(other.x - active.x));
      maxDy = Math.max(maxDy, Math.abs(other.y - active.y));
    }
    return clamp(Math.min(halfWidth / maxDx, halfHeight / maxDy) / baseScale, 0.6, 1.25);
  }

  function update(dt: number) {
    const active = activeId ? byId.get(activeId) ?? null : null;
    const connectedIds = new Set(active ? active.school.connections.map((c) => c.id) : []);

    for (const n of nodes) {
      n.x = n.bx + (reduced ? 0 : Math.sin(time * n.fx + n.px) * FLOAT_AMPLITUDE);
      n.y = n.by + (reduced ? 0 : Math.cos(time * n.fy + n.py) * FLOAT_AMPLITUDE);
    }

    // The camera chases the selected node's (still floating) position, so it stays centered.
    const rate = reduced ? 60 : CAMERA_RATE;
    const f = 1 - Math.exp(-dt * rate);
    camera.x += ((active ? active.x : 0) - camera.x) * f;
    camera.y += ((active ? active.y : 0) - camera.y) * f;
    camera.zoom += ((active && width > 0 && height > 0 ? zoomTargetFor(active) : 1) - camera.zoom) * f;
    camera.oy += ((active ? selectedOffset * height : 0) - camera.oy) * f;

    const fn = 1 - Math.exp(-dt * (reduced ? 60 : 6));
    for (const n of nodes) {
      const isActive = n === active;
      const isConnected = connectedIds.has(n.school.id);
      n.glow += ((isActive ? 1 : isConnected ? 0.5 : 0) - n.glow) * fn;
      n.dim += ((!active || isActive || isConnected ? 1 : 0.38) - n.dim) * fn;
      n.scale += ((isActive ? 1.3 : n.school.id === hoverId ? 1.1 : 1) - n.scale) * fn;
      n.hover += ((n.school.id === hoverId ? 1 : 0) - n.hover) * fn;
    }
    for (const e of edges) {
      const lit = active && (e.a === active || e.b === active) ? 1 : 0;
      e.glow += (lit - e.glow) * (1 - Math.exp(-dt * (reduced ? 60 : 5)));
    }
  }

  function draw() {
    if (!ctx || width === 0 || height === 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const z = baseScale * camera.zoom;
    const cx = width / 2;
    const cy = height / 2 + camera.oy;
    for (const n of nodes) {
      n.sx = cx + (n.x - camera.x) * z;
      n.sy = cy + (n.y - camera.y) * z;
      n.r = NODE_RADIUS * n.scale * z;
    }
    const active = activeId ? byId.get(activeId) ?? null : null;

    const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.75);
    bg.addColorStop(0, "#15183f");
    bg.addColorStop(1, "#04050e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Distant stars drift slightly against the camera for depth.
    for (const s of stars) {
      const x = (((s.x * width - camera.x * z * 0.25 * s.depth) % width) + width) % width;
      const y = (((s.y * height - (camera.y * z + camera.oy) * 0.25 * s.depth) % height) + height) % height;
      const twinkle = reduced ? 0.6 : 0.45 + 0.35 * Math.sin(time * 0.8 + s.phase);
      ctx.fillStyle = `rgba(210, 220, 255, ${twinkle * s.depth})`;
      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    const curve = edges.map((e) => {
      const p0 = { x: e.a.sx, y: e.a.sy };
      const p2 = { x: e.b.sx, y: e.b.sy };
      return { p0, p2, p1: controlPoint(p0, p2, e.bend) };
    });

    // Resting edges: faint, and fainter still while another edge is lit.
    ctx.lineCap = "round";
    edges.forEach((e, i) => {
      const { p0, p1, p2 } = curve[i];
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
      ctx.strokeStyle = `rgba(150, 165, 255, ${0.17 * (1 - 0.75 * e.glow) * (active ? 0.7 : 1)})`;
      ctx.lineWidth = 1.2 * z;
      ctx.stroke();
    });

    // Neon: wide soft strokes, a mid stroke, and a bright core with shadow glow, added together.
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    edges.forEach((e, i) => {
      if (e.glow < 0.01) return;
      const { p0, p1, p2 } = curve[i];
      const [r, g, b] = NEON[e.kind];
      const layers: [number, number][] = [[16, 0.09], [8, 0.2], [2.4, 0.95]];
      layers.forEach(([lineWidth, alpha], layer) => {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * e.glow})`;
        ctx.lineWidth = lineWidth * z;
        ctx.shadowColor = layer === 2 ? `rgba(${r}, ${g}, ${b}, 0.95)` : "transparent";
        ctx.shadowBlur = layer === 2 ? 22 * e.glow : 0;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Light pulses travel outward from the selected school.
      if (!reduced) {
        const forward = active === e.a;
        for (let k = 0; k < 3; k++) {
          const t0 = (time * 0.26 + k / 3 + i * 0.17) % 1;
          const p = quadPoint(p0, p1, p2, forward ? t0 : 1 - t0);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6 * z, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * e.glow})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
          ctx.shadowBlur = 14 * e.glow;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    });
    ctx.restore();

    for (const n of nodes) {
      const hue = n.school.hue;
      ctx.save();
      ctx.globalAlpha = n.dim;
      ctx.shadowColor = `hsla(${hue}, 100%, 62%, ${0.5 + 0.4 * n.glow})`;
      ctx.shadowBlur = (10 + 30 * n.glow + 10 * n.hover) * z;
      const fill = ctx.createRadialGradient(n.sx - n.r * 0.3, n.sy - n.r * 0.35, n.r * 0.1, n.sx, n.sy, n.r);
      fill.addColorStop(0, `hsl(${hue}, 55%, ${22 + 12 * n.glow}%)`);
      fill.addColorStop(1, `hsl(${hue}, 60%, 8%)`);
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, n.r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = (2 + 1.6 * n.glow) * z;
      ctx.strokeStyle = `hsl(${hue}, 100%, ${62 + 10 * n.glow}%)`;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(n.sx, n.sy, n.r * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 100%, 72%, 0.25)`;
      ctx.lineWidth = z;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 6;
      ctx.fillStyle = "rgba(247, 242, 232, 0.96)";
      ctx.font = `${Math.max(12, Math.round(15 * z * (0.95 + 0.15 * n.glow)))}px ${SERIF}`;
      ctx.fillText(n.school.name, n.sx, n.sy + n.r + 21 * z);
      // On a small map, drop the era line from the other schools while one is selected, to cut clutter.
      if (!active || n === active || z >= 0.85) {
        ctx.fillStyle = "rgba(247, 242, 232, 0.6)";
        ctx.font = `${Math.max(10, Math.round(11 * z))}px ${SANS}`;
        ctx.fillText(n.school.era, n.sx, n.sy + n.r + 37 * z);
      }
      ctx.restore();
    }

    // Relationship labels appear on lit edges. On narrow screens they would pile up, so the
    // consumer's summary (which lists the same connections) carries them instead.
    edges.forEach((e, i) => {
      if (e.glow < 0.55 || width < 560) return;
      const { p0, p1, p2 } = curve[i];
      const mid = quadPoint(p0, p1, p2, 0.5);
      const [r, g, b] = NEON[e.kind];
      const alpha = (e.glow - 0.55) / 0.45;
      ctx.save();
      ctx.globalAlpha = alpha;
      const fontSize = Math.max(11, Math.round(11 * z));
      ctx.font = `${fontSize}px ${SANS}`;
      const textWidth = ctx.measureText(e.label).width;
      const w = textWidth + fontSize * 1.6;
      const h = fontSize * 2;
      roundedRect(ctx, mid.x - w / 2, mid.y - h / 2, w, h, h / 2);
      ctx.fillStyle = "rgba(6, 8, 26, 0.88)";
      ctx.fill();
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
      ctx.lineWidth = z;
      ctx.stroke();
      ctx.fillStyle = `rgb(${Math.min(255, r + 70)}, ${Math.min(255, g + 70)}, ${Math.min(255, b + 70)})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(e.label, mid.x, mid.y + 0.5);
      ctx.restore();
    });
  }

  function frame(now: number) {
    if (destroyed) return;
    frameId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    update(dt);
    draw();
  }
  frameId = requestAnimationFrame(frame);

  function nodeAt(clientX: number, clientY: number): NodeState | null {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let best: NodeState | null = null;
    let bestDistance = Infinity;
    for (const n of nodes) {
      const d = Math.hypot(n.sx - x, n.sy - y);
      if (d <= n.r + 10 && d < bestDistance) {
        best = n;
        bestDistance = d;
      }
    }
    return best;
  }

  const onClick = (event: MouseEvent) => {
    const hit = nodeAt(event.clientX, event.clientY);
    onPick(hit ? hit.school.id : null);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const hit = nodeAt(event.clientX, event.clientY);
    hoverId = hit ? hit.school.id : null;
    canvas.style.cursor = hit ? "pointer" : "default";
  };
  const onLeave = () => {
    hoverId = null;
    canvas.style.cursor = "default";
  };
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  return {
    setActive(id) {
      activeId = id && byId.has(id) ? id : null;
    },
    setSelectedOffset(fraction) {
      selectedOffset = fraction;
    },
    setReducedMotion(value) {
      reduced = value;
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    },
  };
}
