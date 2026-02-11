<script lang="ts">
  import type { BaseChallengeProps } from './types';

  interface GravityChallengeProps extends BaseChallengeProps {}

  let {
    onSuccess,
    onFail,
    confirmText = 'Confirm',
  }: GravityChallengeProps = $props();

  interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    radius: number;
    color: string;
    isTarget: boolean;
  }

  let gravityBodies = $state<Body[]>([]);
  let gravityCanvas: HTMLCanvasElement | null = null;
  let gravityAnimationId: number | null = null;
  let gravityStarted = $state(false);
  const GRAVITY_CONSTANT = 0.5;
  const CANVAS_SIZE = 300;

  function initGravitySimulation() {
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    // Central massive body (sun-like)
    const centralBody: Body = {
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      mass: 500,
      radius: 20,
      color: '#fbbf24',
      isTarget: false
    };

    // Orbiting bodies
    const orbiters: Body[] = [];
    const numOrbiters = 4;
    const targetIndex = Math.floor(Math.random() * numOrbiters);

    for (let i = 0; i < numOrbiters; i++) {
      const angle = (i / numOrbiters) * Math.PI * 2;
      const orbitRadius = 80 + Math.random() * 30;
      const orbitalSpeed = Math.sqrt(GRAVITY_CONSTANT * centralBody.mass / orbitRadius) * 0.8;

      orbiters.push({
        x: centerX + Math.cos(angle) * orbitRadius,
        y: centerY + Math.sin(angle) * orbitRadius,
        vx: -Math.sin(angle) * orbitalSpeed,
        vy: Math.cos(angle) * orbitalSpeed,
        mass: 5 + Math.random() * 10,
        radius: 8 + Math.random() * 4,
        color: i === targetIndex ? '#22c55e' : '#6366f1',
        isTarget: i === targetIndex
      });
    }

    gravityBodies = [centralBody, ...orbiters];
    gravityStarted = true;
    requestAnimationFrame(updateGravity);
  }

  function updateGravity() {
    if (!gravityStarted) return;

    const dt = 0.5;
    const bodies = [...gravityBodies];

    // Calculate gravitational forces
    for (let i = 0; i < bodies.length; i++) {
      let fx = 0, fy = 0;

      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;

        const dx = bodies[j].x - bodies[i].x;
        const dy = bodies[j].y - bodies[i].y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < bodies[i].radius + bodies[j].radius) continue;

        const force = (GRAVITY_CONSTANT * bodies[i].mass * bodies[j].mass) / distSq;
        fx += (force * dx) / dist;
        fy += (force * dy) / dist;
      }

      bodies[i].vx += (fx / bodies[i].mass) * dt;
      bodies[i].vy += (fy / bodies[i].mass) * dt;
    }

    // Update positions
    for (const body of bodies) {
      body.x += body.vx * dt;
      body.y += body.vy * dt;

      // Soft boundary - bounce off edges
      if (body.x < body.radius || body.x > CANVAS_SIZE - body.radius) {
        body.vx *= -0.8;
        body.x = Math.max(body.radius, Math.min(CANVAS_SIZE - body.radius, body.x));
      }
      if (body.y < body.radius || body.y > CANVAS_SIZE - body.radius) {
        body.vy *= -0.8;
        body.y = Math.max(body.radius, Math.min(CANVAS_SIZE - body.radius, body.y));
      }
    }

    gravityBodies = bodies;
    renderGravity();

    gravityAnimationId = requestAnimationFrame(updateGravity);
  }

  function renderGravity() {
    if (!gravityCanvas) return;
    const ctx = gravityCanvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw orbital trails (faint)
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Draw bodies
    for (const body of gravityBodies) {
      // Glow effect for target
      if (body.isTarget) {
        const gradient = ctx.createRadialGradient(body.x, body.y, 0, body.x, body.y, body.radius * 2);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw body
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(body.x - body.radius * 0.3, body.y - body.radius * 0.3, body.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw instruction
    ctx.fillStyle = '#888';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Click the green target!', CANVAS_SIZE / 2, CANVAS_SIZE - 10);
  }

  function handleGravityClick(e: MouseEvent) {
    if (!gravityCanvas) return;

    const rect = gravityCanvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    for (const body of gravityBodies) {
      const dx = clickX - body.x;
      const dy = clickY - body.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= body.radius + 5) {
        if (body.isTarget) {
          cleanup();
          onSuccess();
        } else if (!body.isTarget && body.mass < 100) {
          onFail('Wrong target! Click the green one.');
        }
        return;
      }
    }
  }

  function cleanup() {
    if (gravityAnimationId) {
      cancelAnimationFrame(gravityAnimationId);
      gravityAnimationId = null;
    }
    gravityStarted = false;
  }

  // Initialize on mount
  $effect(() => {
    initGravitySimulation();
    return () => cleanup();
  });

  export function reset() {
    cleanup();
    initGravitySimulation();
  }
</script>

<div class="gravity-challenge">
  <p class="gravity-instruction">Click the orbiting <span class="target-hint">green target</span> to confirm</p>
  <div class="gravity-container">
    <canvas
      bind:this={gravityCanvas}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      class="gravity-canvas"
      onclick={handleGravityClick}
    ></canvas>
  </div>
</div>

<style>
  .gravity-challenge {
    text-align: center;
  }

  .gravity-instruction {
    font-size: 0.875rem;
    color: var(--cc-text-muted, #888);
    margin-bottom: 1rem;
  }

  .target-hint {
    color: #22c55e;
    font-weight: 600;
  }

  .gravity-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .gravity-canvas {
    border-radius: 12px;
    cursor: crosshair;
    max-width: 100%;
    height: auto;
    border: 2px solid var(--cc-border, #333);
    transition: border-color 0.2s ease;
  }

  .gravity-canvas:hover {
    border-color: var(--cc-primary, #6366f1);
  }
</style>
