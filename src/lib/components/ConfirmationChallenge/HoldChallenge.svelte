<script lang="ts">
  import type { BaseChallengeProps } from './types';

  interface HoldChallengeProps extends BaseChallengeProps {
    holdDuration?: number;
  }

  let {
    onSuccess,
    onFail,
    confirmText = 'Confirm',
    holdDuration = 2000,
  }: HoldChallengeProps = $props();

  let holdProgress = $state(0);
  let holdInterval: ReturnType<typeof setInterval> | null = null;
  let isHolding = $state(false);

  function handleHoldStart() {
    if (isHolding) return;
    isHolding = true;
    holdProgress = 0;

    const startTime = Date.now();
    holdInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      holdProgress = Math.min(100, (elapsed / holdDuration) * 100);

      if (elapsed >= holdDuration) {
        clearInterval(holdInterval!);
        holdInterval = null;
        isHolding = false;
        onSuccess();
      }
    }, 16);
  }

  function handleHoldEnd() {
    if (!isHolding) return;
    isHolding = false;

    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }

    if (holdProgress < 100) {
      holdProgress = 0;
    }
  }

  export function reset() {
    holdProgress = 0;
    isHolding = false;
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }
</script>

<button
  class="hold-button"
  class:holding={isHolding}
  onmousedown={handleHoldStart}
  onmouseup={handleHoldEnd}
  onmouseleave={handleHoldEnd}
  ontouchstart={handleHoldStart}
  ontouchend={handleHoldEnd}
  aria-label="Hold to confirm"
>
  <div class="hold-progress" style="width: {holdProgress}%"></div>
  <span class="hold-text">
    {#if isHolding}
      Hold... {Math.round(holdProgress)}%
    {:else}
      Hold to {confirmText.toLowerCase()}
    {/if}
  </span>
  <div class="hold-ring">
    <svg viewBox="0 0 36 36">
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray={100}
        stroke-dashoffset={100 - holdProgress}
        transform="rotate(-90 18 18)"
      />
    </svg>
  </div>
</button>

<style>
  .hold-button {
    position: relative;
    width: 100%;
    height: 56px;
    background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%);
    border: 2px solid var(--cc-border, #333);
    border-radius: 28px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .hold-button:hover {
    border-color: var(--cc-primary, #6366f1);
  }

  .hold-button.holding {
    border-color: var(--cc-primary, #6366f1);
    transform: scale(0.98);
  }

  .hold-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--cc-primary, #6366f1) 0%, #818cf8 100%);
    transition: width 0.05s linear;
    border-radius: 28px 0 0 28px;
  }

  .hold-text {
    position: relative;
    z-index: 1;
    color: var(--cc-text, #fff);
    font-weight: 500;
    font-size: 0.875rem;
  }

  .hold-ring {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    opacity: 0.5;
  }

  .hold-ring svg {
    width: 100%;
    height: 100%;
  }

  .hold-ring circle {
    transition: stroke-dashoffset 0.05s linear;
  }
</style>
