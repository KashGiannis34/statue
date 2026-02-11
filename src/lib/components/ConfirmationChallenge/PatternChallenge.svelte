<script lang="ts">
  import type { BaseChallengeProps } from './types';

  interface PatternChallengeProps extends BaseChallengeProps {
    patternSequence?: number[];
  }

  let {
    onSuccess,
    onFail,
    confirmText = 'Confirm',
    patternSequence = [1, 2, 3, 4],
  }: PatternChallengeProps = $props();

  let patternInput = $state<number[]>([]);
  let patternHighlight = $state<number | null>(null);

  function handlePatternClick(num: number) {
    patternHighlight = num;
    setTimeout(() => (patternHighlight = null), 200);

    const nextIndex = patternInput.length;
    const expected = patternSequence[nextIndex];

    if (num === expected) {
      patternInput = [...patternInput, num];

      if (patternInput.length === patternSequence.length) {
        onSuccess();
      }
    } else {
      onFail('Wrong sequence! Starting over...');
      patternInput = [];
    }
  }

  export function reset() {
    patternInput = [];
    patternHighlight = null;
  }
</script>

<div class="pattern-challenge">
  <p class="pattern-instruction">
    Tap the numbers in order: <strong>{patternSequence.join(' → ')}</strong>
  </p>
  <div class="pattern-grid">
    {#each [1, 2, 3, 4] as num}
      <button
        class="pattern-button"
        class:highlighted={patternHighlight === num}
        class:selected={patternInput.includes(num)}
        onclick={() => handlePatternClick(num)}
        aria-label="Number {num}"
      >
        {num}
      </button>
    {/each}
  </div>
  <div class="pattern-progress">
    {#each patternSequence as num, i}
      <span
        class="pattern-dot"
        class:filled={patternInput.length > i}
      ></span>
    {/each}
  </div>
</div>

<style>
  .pattern-challenge {
    text-align: center;
  }

  .pattern-instruction {
    font-size: 0.875rem;
    color: var(--cc-text-muted, #888);
    margin-bottom: 1rem;
  }

  .pattern-instruction strong {
    color: var(--cc-primary, #6366f1);
  }

  .pattern-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 200px;
    margin: 0 auto;
  }

  .pattern-button {
    aspect-ratio: 1;
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--cc-border, #333);
    border: 2px solid transparent;
    border-radius: 12px;
    color: var(--cc-text, #fff);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pattern-button:hover {
    border-color: var(--cc-primary, #6366f1);
    transform: scale(1.05);
  }

  .pattern-button.highlighted {
    background: var(--cc-primary, #6366f1);
    transform: scale(0.95);
  }

  .pattern-button.selected {
    background: var(--cc-success, #22c55e);
    color: white;
  }

  .pattern-progress {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 1rem;
  }

  .pattern-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--cc-border, #333);
    transition: all 0.2s ease;
  }

  .pattern-dot.filled {
    background: var(--cc-success, #22c55e);
    transform: scale(1.2);
  }
</style>
