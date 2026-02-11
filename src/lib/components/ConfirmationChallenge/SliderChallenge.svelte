<script lang="ts">
  import type { BaseChallengeProps } from './types';

  interface SliderChallengeProps extends BaseChallengeProps {}

  let {
    onSuccess,
    onFail,
    confirmText = 'Confirm',
  }: SliderChallengeProps = $props();

  let sliderValue = $state(0);
  let isDragging = $state(false);
  let sliderTrack: HTMLDivElement | null = null;

  function handleSliderStart(e: MouseEvent | TouchEvent) {
    isDragging = true;
    updateSliderPosition(e);
  }

  function handleSliderMove(e: MouseEvent | TouchEvent) {
    if (!isDragging) return;
    updateSliderPosition(e);
  }

  function handleSliderEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (sliderValue >= 95) {
      sliderValue = 100;
      onSuccess();
    } else {
      sliderValue = 0;
    }
  }

  function updateSliderPosition(e: MouseEvent | TouchEvent) {
    if (!sliderTrack) return;

    const rect = sliderTrack.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    sliderValue = Math.max(0, Math.min(100, position));
  }

  export function reset() {
    sliderValue = 0;
    isDragging = false;
  }
</script>

<svelte:window
  onmousemove={handleSliderMove}
  onmouseup={handleSliderEnd}
  ontouchmove={handleSliderMove}
  ontouchend={handleSliderEnd}
/>

<div
  class="slider-track"
  bind:this={sliderTrack}
  onmousedown={handleSliderStart}
  ontouchstart={handleSliderStart}
  role="slider"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={sliderValue}
  tabindex="0"
>
  <div class="slider-fill" style="width: {sliderValue}%"></div>
  <div class="slider-thumb" style="left: {sliderValue}%">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
  <span class="slider-label" class:hidden={sliderValue > 20}>
    Slide to {confirmText.toLowerCase()}
  </span>
</div>

<style>
  .slider-track {
    position: relative;
    height: 56px;
    background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%);
    border-radius: 28px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    touch-action: none;
    border: 2px solid var(--cc-border, #333);
  }

  .slider-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--cc-primary, #6366f1) 0%, #818cf8 100%);
    transition: width 0.1s ease;
    border-radius: 28px 0 0 28px;
  }

  .slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition: left 0.1s ease;
    color: var(--cc-primary, #6366f1);
  }

  .slider-thumb svg {
    width: 24px;
    height: 24px;
  }

  .slider-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--cc-text-muted, #888);
    font-size: 0.875rem;
    font-weight: 500;
    pointer-events: none;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  .slider-label.hidden {
    opacity: 0;
  }
</style>
